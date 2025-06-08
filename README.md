# Copy Code Block - Chrome Extension

A Chrome extension that automatically adds copy buttons to code blocks on web pages, making it easy to copy code snippets with a single click.

## 🚀 Features

- **Automatic Detection**: Finds all code blocks on web pages using various selectors
- **One-Click Copy**: Adds a convenient copy button to each code block
- **Universal Compatibility**: Works on major coding websites like GitHub, Stack Overflow, MDN, CodePen, and more
- **Dynamic Content Support**: Detects code blocks added dynamically via JavaScript
- **Smart Positioning**: Copy buttons are intelligently positioned for optimal visibility
- **Visual Feedback**: Shows success/error feedback when copying
- **Modern Design**: Beautiful, responsive UI with theme adaptations
- **Statistics Tracking**: Tracks usage statistics in the popup
- **Accessibility**: Full keyboard navigation and screen reader support

## 📸 Screenshots

*Note: Add screenshots here showing the extension in action on different websites*

## 🔧 Installation

### From Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store
2. Search for "Copy Code Block"
3. Click "Add to Chrome"

### Manual Installation (Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension will be installed and ready to use

## 🎯 How It Works

1. **Automatic Detection**: When you visit a webpage, the extension scans for code blocks using comprehensive selectors
2. **Button Insertion**: A copy button is added to the top-right corner of each detected code block
3. **Smart Copying**: Clicking the button copies the clean code text to your clipboard
4. **Visual Feedback**: The button shows "Copied!" confirmation with color change

## 🌐 Supported Websites

The extension works on all websites but is specially optimized for:

- **GitHub** - Repository code, gists, documentation
- **Stack Overflow** - Code snippets in questions and answers
- **MDN Web Docs** - JavaScript, CSS, HTML examples
- **CodePen** - Code editor blocks
- **Dev.to** - Article code blocks
- **Medium** - Technical articles with code
- **Documentation sites** - API docs, tutorials, guides
- **Blog posts** - Technical blogs with code examples

## ⚙️ Technical Details

### File Structure

```
copy-code-block/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── styles.css           # Copy button styles
├── popup.html           # Extension popup interface
├── popup.css            # Popup styling
├── popup.js             # Popup functionality
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

### Code Block Detection

The extension uses multiple CSS selectors to find code blocks:

- `pre code` - Standard code blocks
- `pre` - Preformatted text
- `.highlight pre` - Syntax highlighted code (GitHub, etc.)
- `.hljs` - Highlight.js library
- `.CodeMirror` - CodeMirror editor
- And many more...

### Smart Features

- **Line Number Removal**: Automatically removes line numbers from copied code
- **Clean Text Extraction**: Strips HTML formatting while preserving code structure
- **Fallback Support**: Uses `document.execCommand` if Clipboard API is unavailable
- **Performance Optimized**: Efficient DOM scanning with mutation observers
- **Memory Management**: Proper cleanup to prevent memory leaks

## 🛠️ Development

### Prerequisites

- Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript
- Chrome Extension development basics

### Building from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/copy-code-block.git
   cd copy-code-block
   ```

2. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the project directory

3. Make changes and reload the extension to test

### Key Files to Modify

- **`content.js`**: Main functionality, code detection logic
- **`styles.css`**: Copy button appearance and animations
- **`popup.html/js/css`**: Extension popup interface
- **`manifest.json`**: Extension permissions and metadata

## 🎨 Customization

### Styling Copy Buttons

The copy buttons can be styled by modifying `styles.css`. Key classes:

- `.code-copy-button` - Main button styling
- `.code-copy-button:hover` - Hover effects
- `.copy-success` - Success state styling
- `.copy-error` - Error state styling

### Adding New Selectors

To support additional code block formats, add selectors to the `codeSelectors` array in `content.js`:

```javascript
const codeSelectors = [
  'pre code',
  'pre',
  '.your-custom-selector', // Add here
  // ... existing selectors
];
```

## 🐛 Known Issues

- Some websites with complex CSS layouts may require manual positioning adjustments
- Heavy dynamic content sites may need increased mutation observer delays
- Very large code blocks (>50KB) may have slight performance impact

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Test on multiple websites before submitting
- Update README for new features
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/your-username/copy-code-block/issues)
- **Feature Requests**: [Feature Request Template](https://github.com/your-username/copy-code-block/issues/new?template=feature_request.md)
- **Questions**: [Discussions](https://github.com/your-username/copy-code-block/discussions)

## 📊 Stats & Analytics

The extension includes basic usage analytics:
- Number of code blocks detected
- Number of successful copies
- No personal data is collected or transmitted

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Automatic code block detection
- Copy button insertion
- Support for major coding websites
- Popup interface with statistics
- Theme adaptations and accessibility features

## 🚀 Roadmap

- [ ] Chrome Web Store publication
- [ ] Firefox addon port
- [ ] Custom copy button themes
- [ ] Code syntax detection and highlighting
- [ ] Export/import settings
- [ ] Advanced filtering options
- [ ] Copy history feature

## 🙏 Acknowledgments

- Icons and design inspiration from modern Chrome extensions
- Code detection patterns from popular syntax highlighters
- Community feedback and testing

---

**Made with ❤️ for developers who copy a lot of code!** 