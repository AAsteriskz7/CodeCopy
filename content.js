// Copy Code Block Extension - Content Script
// Automatically adds copy buttons to code blocks on web pages

class CodeBlockCopier {
  constructor() {
    this.copyButtons = new Set();
    this.observer = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.processCodeBlocks());
    } else {
      this.processCodeBlocks();
    }

    // Set up mutation observer for dynamically added content
    this.setupMutationObserver();
  }

  processCodeBlocks() {
    // Find all code blocks using various selectors
    const codeSelectors = [
      'pre code',
      'pre',
      '.highlight pre',
      '.codehilite pre',
      '.highlight code',
      'div[class*="highlight"] pre',
      'div[class*="code"] pre',
      '.language-* pre',
      'code[class*="language-"]',
      '.hljs',
      '.CodeMirror',
      '.ace_editor'
    ];

    const codeBlocks = new Set();

    // Collect all code blocks
    codeSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (this.isValidCodeBlock(element)) {
            codeBlocks.add(element);
          }
        });
      } catch (e) {
        // Continue if selector fails
      }
    });

    // Process each unique code block
    codeBlocks.forEach(block => this.addCopyButton(block));
  }

  isValidCodeBlock(element) {
    // Check if element is a valid code block
    if (!element || element.offsetHeight === 0 || element.offsetWidth === 0) {
      return false;
    }

    // Skip if already has a copy button
    if (element.querySelector('.code-copy-button')) {
      return false;
    }

    // Check if element contains code-like content
    const text = element.textContent || element.innerText;
    if (!text || text.trim().length < 10) {
      return false;
    }

    // Skip if it's just a single word or short phrase
    if (text.trim().split(/\s+/).length < 2 && text.length < 20) {
      return false;
    }

    return true;
  }

  addCopyButton(codeBlock) {
    try {
      // Create the copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'code-copy-button';
      copyButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        </svg>
        <span class="copy-text">Copy</span>
      `;
      copyButton.title = 'Copy code to clipboard';

      // Add click event listener
      copyButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.copyCode(codeBlock, copyButton);
      });

      // Position the button
      this.positionCopyButton(codeBlock, copyButton);

      // Keep track of the button
      this.copyButtons.add(copyButton);

    } catch (error) {
      console.error('Error adding copy button:', error);
    }
  }

  positionCopyButton(codeBlock, copyButton) {
    // Find the best container for the button
    let container = codeBlock;
    
    // Check if the code block is inside a pre tag
    if (codeBlock.tagName === 'CODE' && codeBlock.parentElement?.tagName === 'PRE') {
      container = codeBlock.parentElement;
    }

    // Check if there's a wrapper div
    const wrapper = container.closest('.highlight, .codehilite, [class*="highlight"], [class*="code"]');
    if (wrapper) {
      container = wrapper;
    }

    // Make container relative if it's not already positioned
    const containerStyle = window.getComputedStyle(container);
    if (containerStyle.position === 'static') {
      container.style.position = 'relative';
    }

    // Add the button to the container
    container.appendChild(copyButton);
  }

  async copyCode(codeBlock, button) {
    try {
      // Get the code text
      let codeText = this.extractCodeText(codeBlock);

      // Copy to clipboard
      await navigator.clipboard.writeText(codeText);

      // Show success feedback
      this.showCopyFeedback(button, 'Copied!', 'success');

    } catch (error) {
      console.error('Failed to copy code:', error);
      
      // Fallback to document.execCommand
      try {
        const textArea = document.createElement('textarea');
        textArea.value = this.extractCodeText(codeBlock);
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        this.showCopyFeedback(button, 'Copied!', 'success');
      } catch (fallbackError) {
        this.showCopyFeedback(button, 'Failed', 'error');
      }
    }
  }

  extractCodeText(codeBlock) {
    // Clone the element to avoid modifying the original
    const clone = codeBlock.cloneNode(true);

    // Remove any copy buttons from the clone
    const copyButtons = clone.querySelectorAll('.code-copy-button');
    copyButtons.forEach(btn => btn.remove());

    // Remove line numbers if present
    const lineNumbers = clone.querySelectorAll('.line-number, .lineno, [class*="line-number"]');
    lineNumbers.forEach(ln => ln.remove());

    // Get the text content
    let text = clone.textContent || clone.innerText || '';

    // Clean up the text
    text = text.replace(/^\s*\n|\n\s*$/g, ''); // Remove leading/trailing newlines
    
    return text;
  }

  showCopyFeedback(button, message, type) {
    const originalContent = button.innerHTML;
    const textElement = button.querySelector('.copy-text');
    
    if (textElement) {
      textElement.textContent = message;
    }
    
    button.classList.add(`copy-${type}`);

    // Reset after 2 seconds
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.classList.remove(`copy-${type}`);
    }, 2000);
  }

  setupMutationObserver() {
    // Watch for dynamically added content
    this.observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node contains code blocks
              if (node.querySelector && (
                node.querySelector('pre') ||
                node.querySelector('code') ||
                node.matches && node.matches('pre, code')
              )) {
                shouldProcess = true;
              }
            }
          });
        }
      });

      if (shouldProcess) {
        // Debounce processing
        clearTimeout(this.processTimeout);
        this.processTimeout = setTimeout(() => {
          this.processCodeBlocks();
        }, 500);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  destroy() {
    // Clean up
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.copyButtons.forEach(button => {
      if (button.parentNode) {
        button.parentNode.removeChild(button);
      }
    });
    
    this.copyButtons.clear();
  }
}

// Initialize the extension
let codeBlockCopier;

// Handle extension updates/reloads
if (window.codeBlockCopier) {
  window.codeBlockCopier.destroy();
}

codeBlockCopier = new CodeBlockCopier();
window.codeBlockCopier = codeBlockCopier;

// Handle page navigation (for SPAs)
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    setTimeout(() => {
      codeBlockCopier.processCodeBlocks();
    }, 1000);
  }
}, 1000); 