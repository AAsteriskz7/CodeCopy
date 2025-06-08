# Installation Guide - Copy Code Block Extension

## 🚀 Quick Start

Follow these steps to install and test the Copy Code Block Chrome extension:

### Step 1: Enable Chrome Developer Mode

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Toggle on **"Developer mode"** in the top-right corner

### Step 2: Load the Extension

1. Click **"Load unpacked"** button
2. Select the folder containing all the extension files
3. The extension should appear in your extensions list
4. Make sure it's **enabled** (toggle switch should be blue)

### Step 3: Test the Extension

1. Open the included `test.html` file in Chrome
2. You should see copy buttons appear on all code blocks
3. Click any copy button to test the functionality
4. Check the extension popup by clicking the extension icon

## 📝 Before Installing

### Required Files

Make sure your extension folder contains these files:

```
📁 copy-code-block/
├── 📄 manifest.json          ✅ Extension configuration
├── 📄 content.js             ✅ Main functionality  
├── 📄 styles.css             ✅ Copy button styles
├── 📄 popup.html             ✅ Extension popup
├── 📄 popup.css              ✅ Popup styling
├── 📄 popup.js               ✅ Popup functionality
├── 📄 test.html              ✅ Test page
├── 📁 icons/                 ⚠️  Need icon files
│   ├── icon16.png           ❌ Missing (optional)
│   ├── icon32.png           ❌ Missing (optional)
│   ├── icon48.png           ❌ Missing (optional)
│   └── icon128.png          ❌ Missing (optional)
└── 📄 README.md             ✅ Documentation
```

**Note:** The extension will work without icon files, but Chrome will show default icons.

## 🎯 Testing the Extension

### Automatic Testing
1. Open `test.html` in your browser
2. Look for copy buttons on each code block
3. Test copying functionality

### Manual Testing
Visit these popular coding websites:
- **GitHub**: https://github.com/microsoft/vscode
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/javascript
- **MDN**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **CodePen**: https://codepen.io/trending

### Extension Popup
- Click the extension icon in the toolbar
- Check statistics and status
- Try the refresh and settings buttons

## 🔧 Troubleshooting

### Extension Not Loading
- ✅ Check that Developer mode is enabled
- ✅ Verify all required files are present
- ✅ Look for errors in `chrome://extensions/`
- ✅ Try refreshing the extension

### Copy Buttons Not Appearing
- ✅ Refresh the webpage
- ✅ Check browser console for errors (F12)
- ✅ Verify the extension is enabled
- ✅ Test on the included `test.html` file first

### Copy Functionality Not Working
- ✅ Check clipboard permissions
- ✅ Try on different websites
- ✅ Look for JavaScript errors in console

### Extension Icon Missing
- ✅ Add icon files to the `icons/` folder
- ✅ Reload the extension
- ✅ Icons are optional for functionality

## 🎨 Adding Icons (Optional)

To add custom icons:

1. Create PNG files with these exact names:
   - `icon16.png` (16×16 pixels)
   - `icon32.png` (32×32 pixels) 
   - `icon48.png` (48×48 pixels)
   - `icon128.png` (128×128 pixels)

2. Place them in the `icons/` folder

3. Reload the extension in `chrome://extensions/`

**Tip:** You can find free icons at [Icons8](https://icons8.com/) or [Flaticon](https://www.flaticon.com/)

## 🚀 Next Steps

Once installed successfully:

1. **Browse coding websites** - The extension works automatically
2. **Check the popup** - View statistics and settings  
3. **Customize styling** - Edit `styles.css` if desired
4. **Report issues** - Use the feedback links in the popup

## ⚡ Performance Notes

- The extension scans for code blocks automatically
- Works on dynamically loaded content (SPAs)
- Minimal performance impact
- Uses modern browser APIs

## 🔄 Updating the Extension

To update after making changes:

1. Go to `chrome://extensions/`
2. Click the **refresh icon** on your extension
3. Test the changes on a webpage

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Copy buttons appear on code blocks
- ✅ Clicking buttons copies code to clipboard
- ✅ Extension popup shows statistics
- ✅ Works across different websites

---

**Need help?** Check the main README.md or open an issue on GitHub! 