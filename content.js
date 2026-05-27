// Copy Code Block Extension - Content Script
// Clean and elegant integration with popup settings, animations, and storage

const COPY_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; display: inline-block; vertical-align: middle;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const SUCCESS_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; display: inline-block; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

class CodeBlockCopier {
  constructor() {
    this.copyButtons = new Map(); // Keep track of codeBlock -> button mapping
    this.copiesMade = 0;
    this.settings = {
      theme: 'gradient',
      position: 'top-right',
      autoHide: false,
      stripLines: true,
      blocklist: ''
    };
    this.init();
  }

  async init() {
    await this.loadSettings();
    if (this.isCurrentPageExcluded()) {
      return;
    }
    this.processCodeBlocks();
    this.setupMutationObserver();
    this.setupStorageListener();
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['theme', 'position', 'autoHide', 'stripLines', 'blocklist'], (res) => {
        if (res.theme) this.settings.theme = res.theme;
        if (res.position) this.settings.position = res.position;
        if (res.autoHide !== undefined) this.settings.autoHide = res.autoHide;
        if (res.stripLines !== undefined) this.settings.stripLines = res.stripLines;
        if (res.blocklist !== undefined) this.settings.blocklist = res.blocklist;
        resolve();
      });
    });
  }

  isCurrentPageExcluded() {
    if (!this.settings.blocklist) return false;
    const url = window.location.href;
    const lines = this.settings.blocklist.split('\n');
    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed && url.includes(trimmed)) {
        return true;
      }
    }
    return false;
  }

  setupStorageListener() {
    chrome.storage.onChanged.addListener((changes) => {
      let settingsChanged = false;
      for (let key in changes) {
        if (key in this.settings) {
          this.settings[key] = changes[key].newValue;
          settingsChanged = true;
        }
      }
      if (settingsChanged) {
        this.updateAllButtons();
      }
    });
  }

  updateAllButtons() {
    if (this.isCurrentPageExcluded()) {
      this.removeAllButtons();
      return;
    }

    // Process new code blocks
    this.processCodeBlocks();

    // Update styling class names for all existing buttons
    this.copyButtons.forEach((button, codeBlock) => {
      button.className = 'code-copy-button';
      button.classList.add(`theme-${this.settings.theme}`);
      button.classList.add(`pos-${this.settings.position}`);
      
      const container = button.parentElement;
      if (container) {
        if (this.settings.autoHide) {
          container.classList.add('code-copy-btn-autohide');
        } else {
          container.classList.remove('code-copy-btn-autohide');
        }
      }
    });
  }

  removeAllButtons() {
    this.copyButtons.forEach((button) => {
      const container = button.parentElement;
      if (container) {
        container.classList.remove('code-copy-btn-autohide');
      }
      button.remove();
    });
    this.copyButtons.clear();
  }

  processCodeBlocks() {
    const selectors = ['pre', 'code', '.highlight', '.codehilite'];
    const codeBlocks = new Set();

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(block => {
        if (this.isValidCodeBlock(block)) {
          codeBlocks.add(block);
        }
      });
    });

    codeBlocks.forEach(block => this.addCopyButton(block));
  }

  isValidCodeBlock(element) {
    if (!element || element.offsetHeight < 20 || element.offsetWidth < 50) return false;
    if (element.querySelector('.code-copy-button')) return false;
    
    // Check if parent already has a button to avoid duplicates
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      if (parent.querySelector('.code-copy-button')) return false;
      parent = parent.parentElement;
    }
    
    const text = element.textContent || '';
    return text.trim().length > 15;
  }

  addCopyButton(codeBlock) {
    if (this.isCurrentPageExcluded()) return;

    // Find the best container
    let container = codeBlock;
    if (codeBlock.tagName === 'CODE' && codeBlock.parentElement?.tagName === 'PRE') {
      container = codeBlock.parentElement;
    }
    
    const wrapper = container.closest('.highlight, .codehilite');
    if (wrapper && !wrapper.querySelector('.code-copy-button')) {
      container = wrapper;
    }

    if (container.querySelector('.code-copy-button')) {
      return;
    }

    const button = document.createElement('button');
    button.className = `code-copy-button theme-${this.settings.theme} pos-${this.settings.position}`;
    button.title = 'Copy code';
    button.innerHTML = `${COPY_SVG}<span class="copy-text">Copy</span>`;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.copyCode(codeBlock, button);
    });

    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    if (this.settings.autoHide) {
      container.classList.add('code-copy-btn-autohide');
    }

    container.appendChild(button);
    this.copyButtons.set(codeBlock, button);
  }

  async copyCode(codeBlock, button) {
    try {
      const text = this.getCodeText(codeBlock);
      await navigator.clipboard.writeText(text);
      
      button.innerHTML = `${SUCCESS_SVG}<span class="copy-text">Copied!</span>`;
      button.classList.add('copy-success');
      
      this.copiesMade++;
      
      // Increment lifetime copies in storage
      chrome.storage.local.get(['lifetimeCopies'], (res) => {
        const lifetime = (res.lifetimeCopies || 0) + 1;
        chrome.storage.local.set({ lifetimeCopies: lifetime });
      });

      setTimeout(() => {
        button.innerHTML = `${COPY_SVG}<span class="copy-text">Copy</span>`;
        button.classList.remove('copy-success');
      }, 1500);

    } catch (error) {
      button.innerHTML = `${COPY_SVG}<span class="copy-text">Failed</span>`;
      button.classList.add('copy-error');
      setTimeout(() => {
        button.innerHTML = `${COPY_SVG}<span class="copy-text">Copy</span>`;
        button.classList.remove('copy-error');
      }, 1500);
    }
  }

  getCodeText(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('.code-copy-button').forEach(btn => btn.remove());
    
    if (this.settings.stripLines) {
      // List of common selectors for line numbers and gutters
      const lineSelectors = [
        '.js-line-number',       // GitHub
        '.gutter',               // StackOverflow, Prism, etc.
        '.line-numbers-rows',    // Prism
        '.hljs-ln-n',            // Highlight.js
        '.lineno',               // Pygments/Sphinx
        '.line-number',
        'td.blob-num',           // GitHub line number column
        '.code-line-number'
      ];
      
      lineSelectors.forEach(selector => {
        clone.querySelectorAll(selector).forEach(el => el.remove());
      });
    }

    return clone.textContent || clone.innerText || '';
  }

  setupMutationObserver() {
    const observer = new MutationObserver(() => {
      setTimeout(() => this.processCodeBlocks(), 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize
const copier = new CodeBlockCopier();

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    sendResponse({
      codeBlocks: copier.copyButtons.size,
      copiesMade: copier.copiesMade
    });
  } else if (request.action === 'ping') {
    sendResponse({ status: 'active' });
  }
  return true;
});