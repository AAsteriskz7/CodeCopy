// Copy Code Block Extension - Popup Script

class PopupManager {
  constructor() {
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.updateStats();
    this.checkExtensionStatus();
  }

  setupEventListeners() {
    document.getElementById('refresh-btn').addEventListener('click', () => {
      this.refreshCurrentTab();
    });

    document.getElementById('toggle-btn').addEventListener('click', () => {
      alert('Settings coming soon!');
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
        document.getElementById('blocks-found').textContent = response.codeBlocks || 0;
        document.getElementById('copies-made').textContent = response.copiesMade || 0;
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
          'The extension may not be active on this page type.';
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