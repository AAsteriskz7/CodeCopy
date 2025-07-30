// Copy Code Block Extension - Content Script
// Simple and clean implementation

class CodeBlockCopier {
  constructor() {
    this.copyButtons = new Set();
    this.copiesMade = 0;
    this.init();
  }

  init() {
    this.addStyles();
    this.processCodeBlocks();
    this.setupMutationObserver();
  }

  addStyles() {
    if (document.getElementById('copy-button-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'copy-button-styles';
    style.textContent = `
      .code-copy-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 8px;
        font-size: 11px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #333;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
        z-index: 9999;
        backdrop-filter: blur(4px);
      }
      .code-copy-btn:hover {
        background: rgba(240, 240, 240, 0.95);
      }
      .code-copy-btn.success {
        background: rgba(219, 234, 254, 0.9);
        color: #1d4ed8;
        border-color: #3b82f6;
      }
    `;
    document.head.appendChild(style);
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
    if (element.querySelector('.code-copy-btn')) return false;

    // Check if parent already has a button to avoid duplicates
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
        if (parent.querySelector('.code-copy-btn')) return false;
        parent = parent.parentElement;
    }

    const style = window.getComputedStyle(element);
    const isBlock = style.display === 'block' || style.display === 'grid' || style.display === 'flex';
    
    if (element.tagName === 'CODE' && (!element.parentElement || element.parentElement.tagName !== 'PRE')) {
        return false;
    }

    if (!isBlock && element.tagName !== 'PRE') {
        return false;
    }

    const text = element.textContent || '';
    return text.trim().length > 15;
}

  addCopyButton(codeBlock) {
    const button = document.createElement('button');
    button.className = 'code-copy-btn';
    button.textContent = 'Copy';
    button.title = 'Copy code';

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.copyCode(codeBlock, button);
    });

    // Find the best container - be more specific to avoid duplicates
    let container = codeBlock;
    
    // If it's a code inside pre, use the pre
    if (codeBlock.tagName === 'CODE' && codeBlock.parentElement?.tagName === 'PRE') {
      container = codeBlock.parentElement;
    }
    
    // If there's a highlight wrapper, use that instead
    const wrapper = container.closest('.highlight, .codehilite');
    if (wrapper && !wrapper.querySelector('.code-copy-btn')) {
      container = wrapper;
    }

    // Double-check we're not adding duplicate
    if (container.querySelector('.code-copy-btn')) {
      return;
    }

    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    container.appendChild(button);
    this.copyButtons.add(button);
  }

  async copyCode(codeBlock, button) {
    try {
      const text = this.getCodeText(codeBlock);
      await navigator.clipboard.writeText(text);
      
      button.textContent = 'Copied!';
      button.classList.add('success');
      this.copiesMade++;

      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('success');
      }, 1500);

    } catch (error) {
      button.textContent = 'Failed';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 1500);
    }
  }

  getCodeText(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('.code-copy-btn').forEach(btn => btn.remove());
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