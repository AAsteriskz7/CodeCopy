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
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
      this.refreshCurrentTab();
    });

    // Settings button
    document.getElementById('toggle-btn').addEventListener('click', () => {
      this.showSettings();
    });

    // Footer links
    document.getElementById('help-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.openHelp();
    });

    document.getElementById('feedback-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.openFeedback();
    });

    document.getElementById('github-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.openGitHub();
    });
  }

  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab;
    } catch (error) {
      console.error('Error getting current tab:', error);
      return null;
    }
  }

  async updateStats() {
    try {
      const tab = await this.getCurrentTab();
      if (!tab) return;

      // Get statistics from the content script
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'getStats' 
      }).catch(() => ({ codeBlocks: 0, copiesMade: 0 }));

      // Update the display
      document.getElementById('blocks-found').textContent = response.codeBlocks || 0;
      document.getElementById('copies-made').textContent = response.copiesMade || 0;

      // Store stats in local storage for persistence
      const stats = await chrome.storage.local.get(['totalCopies', 'totalBlocks']);
      const totalCopies = (stats.totalCopies || 0) + (response.copiesMade || 0);
      const totalBlocks = (stats.totalBlocks || 0) + (response.codeBlocks || 0);

      await chrome.storage.local.set({
        totalCopies: totalCopies,
        totalBlocks: totalBlocks,
        lastUpdate: Date.now()
      });

    } catch (error) {
      console.error('Error updating stats:', error);
      // Show default values if there's an error
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

      // Check if we can communicate with the content script
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'ping' 
      }).catch(() => null);

      if (response && response.status === 'active') {
        this.setStatus('active', 'Extension Active');
        document.querySelector('.status-description').textContent = 
          'Copy buttons are automatically added to code blocks on this page.';
      } else {
        this.setStatus('inactive', 'Extension Inactive');
        document.querySelector('.status-description').textContent = 
          'The extension may not be active on this page type.';
      }

    } catch (error) {
      console.error('Error checking extension status:', error);
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
      this.showNotification('Failed to refresh page', 'error');
    }
  }

  showSettings() {
    // Create a simple settings modal within the popup
    const settingsHTML = `
      <div class="settings-overlay">
        <div class="settings-modal">
          <div class="settings-header">
            <h3>Settings</h3>
            <button class="close-btn">&times;</button>
          </div>
          <div class="settings-content">
            <div class="setting-item">
              <label>
                <input type="checkbox" id="auto-copy" checked> 
                Enable automatic copy button insertion
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="show-feedback" checked> 
                Show copy feedback animation
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="detect-dynamic" checked> 
                Detect dynamically added code blocks
              </label>
            </div>
            <div class="setting-item">
              <button class="reset-stats-btn">Reset Statistics</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add settings to the popup
    const popupContainer = document.querySelector('.popup-container');
    popupContainer.insertAdjacentHTML('beforeend', settingsHTML);

    // Add settings styles
    const settingsStyles = `
      <style>
        .settings-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .settings-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 300px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .settings-header h3 {
          margin: 0;
          color: #111827;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }
        .settings-content {
          padding: 20px;
        }
        .setting-item {
          margin-bottom: 16px;
        }
        .setting-item label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
        }
        .reset-stats-btn {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 12px;
          cursor: pointer;
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', settingsStyles);

    // Settings event listeners
    document.querySelector('.close-btn').addEventListener('click', () => {
      document.querySelector('.settings-overlay').remove();
    });

    document.querySelector('.reset-stats-btn').addEventListener('click', async () => {
      await chrome.storage.local.clear();
      document.getElementById('blocks-found').textContent = '0';
      document.getElementById('copies-made').textContent = '0';
      this.showNotification('Statistics reset', 'success');
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: ${type === 'error' ? '#ef4444' : '#10b981'};
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 1001;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  openHelp() {
    chrome.tabs.create({
      url: 'https://github.com/your-username/copy-code-block#help'
    });
  }

  openFeedback() {
    chrome.tabs.create({
      url: 'https://github.com/your-username/copy-code-block/issues'
    });
  }

  openGitHub() {
    chrome.tabs.create({
      url: 'https://github.com/your-username/copy-code-block'
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});

// Add message listener for real-time updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateStats') {
    document.getElementById('blocks-found').textContent = message.codeBlocks || 0;
    document.getElementById('copies-made').textContent = message.copiesMade || 0;
  }
});

// Update stats periodically
setInterval(async () => {
  const popup = new PopupManager();
  await popup.updateStats();
}, 2000); 