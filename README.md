# 📄 Markdown to PDF Converter

A comprehensive, dependency-free markdown to PDF converter built with pure HTML, CSS, and vanilla JavaScript. No Node.js, npm packages, or external dependencies required!

**[DEMO](https://johnottone.github.io/test2)**

## 🚀 Features

- **Complete Markdown Support**
  - Headers (H1-H6)
  - Bold, Italic, Strikethrough text
  - Ordered and unordered lists
  - Code blocks with syntax highlighting display
  - Inline code
  - Blockquotes
  - Links and images
  - Tables
  - Horizontal rules

- **User-Friendly Interface**
  - Live preview as you type
  - Toolbar with quick formatting buttons
  - Keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic)
  - Split-view editor and preview
  - Responsive design for mobile and desktop

- **PDF Generation**
  - Export to PDF using browser's native print functionality
  - Multiple paper size options (A4, Letter, Legal)
  - Optional page numbers
  - Theme support (Default, GitHub, Dark)
  - Customizable styling options

- **Additional Features**
  - Auto-save to browser's localStorage
  - Multiple color themes
  - No server or build process required
  - Works completely offline

## 🎯 Quick Start

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/johnottone/test2.git
   cd test2
   ```

2. **Open in browser**
   - Simply open `index.html` in any modern web browser
   - No installation or build process needed!

3. **Start converting**
   - Type or paste your Markdown in the left panel
   - See live preview in the right panel
   - Click "Download PDF" to generate your PDF

## 📖 Usage

### Basic Usage

1. **Write Markdown**: Enter your markdown text in the left editor panel
2. **Preview**: See the live preview in the right panel
3. **Export**: Click "Download PDF" to convert to PDF

### Toolbar Buttons

- **B** - Make text bold
- **I** - Make text italic  
- **H1** - Add header
- **🔗** - Insert link
- **</>** - Insert code block
- **📝** - Add list item
- **❝** - Add blockquote
- **⊞** - Insert table template

### Keyboard Shortcuts

- `Ctrl+B` (or `Cmd+B` on Mac) - Bold
- `Ctrl+I` (or `Cmd+I` on Mac) - Italic
- `Tab` - Insert 4 spaces

### PDF Options

- **Include custom styles**: Apply theme styling to PDF
- **Add page numbers**: Include page numbers in PDF footer
- **Paper Size**: Choose between A4, Letter, or Legal
- **Theme**: Select Default, GitHub, or Dark theme

## 📝 Markdown Examples

### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
```

### Text Formatting
```markdown
**bold text**
*italic text*
~~strikethrough~~
```

### Lists
```markdown
- Unordered item 1
- Unordered item 2

1. Ordered item 1
2. Ordered item 2
```

### Code
```markdown
Inline `code` example

```javascript
// Code block
function hello() {
    console.log('Hello, World!');
}
```
```

### Links and Images
```markdown
[Link text](https://example.com)
![Image alt text](image-url.jpg)
```

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Horizontal Rule
```markdown
---
```

## 🎨 Themes

The converter includes three built-in themes:

1. **Default** - Clean, modern styling with purple accents
2. **GitHub** - GitHub-flavored markdown styling
3. **Dark** - Dark mode for reduced eye strain

Select your theme from the dropdown in the options section.

## 🌐 Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid
- Print/PDF functionality

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 🔒 Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Server**: No data is sent to any server
- **No Tracking**: No analytics or tracking scripts
- **Offline Capable**: Works without internet connection
- **Local Storage**: Content auto-saves to your browser only

## 📁 File Structure

```
test2/
├── index.html           # Main HTML file with UI
├── styles.css           # All styling and themes
├── markdown-parser.js   # Markdown parsing engine
├── app.js              # Application logic and PDF generation
└── README.md           # This file
```

## 🛠️ Technical Details

### Architecture

- **No Dependencies**: Pure vanilla JavaScript, no frameworks or libraries
- **No Build Process**: No webpack, babel, or other build tools needed
- **No Package Manager**: No npm, yarn, or other package managers required
- **Modular Design**: Separated concerns (parsing, UI, styling)

### Markdown Parser

The custom markdown parser (`markdown-parser.js`) handles:
- HTML escaping for security
- Block-level elements (headers, lists, tables, blockquotes)
- Inline elements (bold, italic, links, images, code)
- Code block preservation
- Paragraph wrapping

### PDF Generation

PDF generation uses the browser's native `window.print()` API with:
- Custom CSS for print media
- Page break optimization
- Configurable paper sizes
- Optional page numbering
- Theme-aware styling

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Educational Value

This project demonstrates:
- DOM manipulation with vanilla JavaScript
- Regular expressions for text parsing
- CSS Grid and Flexbox layouts
- Browser print API usage
- LocalStorage for data persistence
- Responsive web design
- Event handling and debouncing

Perfect for learning web development without the complexity of modern frameworks!

## 🐛 Known Limitations

- PDF generation requires browser print dialog (browser limitation)
- Some complex markdown features may require extensions
- Nested lists have basic support
- Code syntax highlighting is display-only (no actual highlighting in colors)

## 🔮 Future Enhancements

Potential improvements:
- Export to other formats (HTML, DOCX)
- Import from files
- More themes
- Advanced table features
- Markdown cheatsheet modal
- More keyboard shortcuts

---

**Made with ❤️ using only HTML, CSS, and Vanilla JavaScript**
