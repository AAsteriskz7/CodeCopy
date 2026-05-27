// Copy Code Block Extension - Popup Script
// Controls sliders, loads/saves user settings, and renders statistics

class PopupManager {
  constructor() {
    this.container = document.querySelector('.popup-container');
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadSettings();
    await this.updateStats();
    this.checkExtensionStatus();
    this.setupStorageListener();
  }

  setupEventListeners() {
    // Refresh Tab Button
    document.getElementById('refresh-btn').addEventListener('click', () => {
      this.refreshCurrentTab();
    });

    // Toggle Settings Panel (Slide In)
    document.getElementById('toggle-btn').addEventListener('click', () => {
      this.container.classList.add('show-settings');
    });

    // Back to Dashboard Button (Slide Out)
    document.getElementById('back-btn').addEventListener('click', () => {
      this.container.classList.remove('show-settings');
    });

    // Form settings inputs
    const themeSelect = document.getElementById('theme-select');
    const positionSelect = document.getElementById('position-select');
    const autohideToggle = document.getElementById('autohide-toggle');
    const striplinesToggle = document.getElementById('striplines-toggle');
    const blocklistInput = document.getElementById('blocklist-input');

    themeSelect.addEventListener('change', (e) => {
      chrome.storage.local.set({ theme: e.target.value });
    });

    positionSelect.addEventListener('change', (e) => {
      chrome.storage.local.set({ position: e.target.value });
    });

    autohideToggle.addEventListener('change', (e) => {
      chrome.storage.local.set({ autoHide: e.target.checked });
    });

    striplinesToggle.addEventListener('change', (e) => {
      chrome.storage.local.set({ stripLines: e.target.checked });
    });

    blocklistInput.addEventListener('input', (e) => {
      chrome.storage.local.set({ blocklist: e.target.value });
    });

    // Footer links
    document.getElementById('feedback-link').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'mailto:adarshsetty1@gmail.com' });
    });

    document.getElementById('github-link').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/AAsteriskz7' });
    });

    document.getElementById('coffee-link').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://buymeacoffee.com/aasteriskz' });
    });
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get({
        theme: 'gradient',
        position: 'top-right',
        autoHide: false,
        stripLines: true,
        blocklist: '',
        lifetimeCopies: 0
      }, (items) => {
        document.getElementById('theme-select').value = items.theme;
        document.getElementById('position-select').value = items.position;
        document.getElementById('autohide-toggle').checked = items.autoHide;
        document.getElementById('striplines-toggle').checked = items.stripLines;
        document.getElementById('blocklist-input').value = items.blocklist;
        document.getElementById('lifetime-copies').textContent = items.lifetimeCopies;
        resolve();
      });
    });
  }

  setupStorageListener() {
    // Listen to changes in storage to update lifetime counts immediately
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.lifetimeCopies) {
        document.getElementById('lifetime-copies').textContent = changes.lifetimeCopies.newValue;
        
        // Update page copies made dynamically
        const currentCopiesEl = document.getElementById('copies-made');
        if (currentCopiesEl) {
          const oldVal = parseInt(currentCopiesEl.textContent) || 0;
          const diff = changes.lifetimeCopies.newValue - (changes.lifetimeCopies.oldValue || 0);
          currentCopiesEl.textContent = oldVal + diff;
        }
      }
    });
  }

  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab;
    } catch (error) {
      return null;
    }
  }

  async updateStats() {
    try {
      const tab = await this.getCurrentTab();
      if (!tab) {
        document.getElementById('blocks-found').textContent = '0';
        document.getElementById('copies-made').textContent = '0';
        return;
      }

      try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStats' });
        if (response) {
          document.getElementById('blocks-found').textContent = response.codeBlocks || 0;
          document.getElementById('copies-made').textContent = response.copiesMade || 0;
        }
      } catch (error) {
        document.getElementById('blocks-found').textContent = '0';
        document.getElementById('copies-made').textContent = '0';
      }

    } catch (error) {
      document.getElementById('blocks-found').textContent = '0';
      document.getElementById('copies-made').textContent = '0';
    }
  }

  async checkExtensionStatus() {
    try {
      const tab = await this.getCurrentTab();
      if (!tab) {
        this.setStatus('inactive', 'Extension Inactive');
        return;
      }

      // Don't try to send messaging on chrome:// or other restricted system URLs
      if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
        this.setStatus('inactive', 'Not Active on System Pages');
        document.querySelector('.status-description').textContent = 
          'Chrome extensions cannot run on internal system pages due to security policies.';
        return;
      }

      try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
        if (response && response.status === 'active') {
          this.setStatus('active', 'Extension Active');
          document.querySelector('.status-description').textContent = 
            'Copy buttons are automatically added to code blocks on this page.';
        } else {
          this.setStatus('inactive', 'Extension Inactive');
        }
      } catch (error) {
        this.setStatus('inactive', 'Extension Inactive');
        document.querySelector('.status-description').textContent = 
          'Please refresh this page, or try another technical site containing code snippets.';
      }

    } catch (error) {
      this.setStatus('inactive', 'Status Unknown');
    }
  }

  setStatus(status, text) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('status-text');

    statusDot.className = `status-dot ${status}`;
    statusText.textContent = text;
  }

  async refreshCurrentTab() {
    try {
      const tab = await this.getCurrentTab();
      if (tab) {
        await chrome.tabs.reload(tab.id);
        window.close();
      }
    } catch (error) {
      console.error('Error refreshing tab:', error);
    }
  }
}

// Initialize popup
new PopupManager();