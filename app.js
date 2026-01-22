/**
 * Main Application Logic
 * Handles UI interactions, preview updates, and PDF generation
 */

// Initialize the markdown parser
const parser = new MarkdownParser();

// Get DOM elements
const markdownInput = document.getElementById('markdownInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');
const refreshBtn = document.getElementById('refreshBtn');
const themeSelect = document.getElementById('theme');

// Toolbar buttons
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const headingBtn = document.getElementById('headingBtn');
const linkBtn = document.getElementById('linkBtn');
const codeBtn = document.getElementById('codeBtn');
const listBtn = document.getElementById('listBtn');
const quoteBtn = document.getElementById('quoteBtn');
const tableBtn = document.getElementById('tableBtn');

// Update preview function
function updatePreview() {
    const markdown = markdownInput.value;
    const html = parser.parse(markdown);
    preview.innerHTML = html;
}

// Debounce function for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Auto-update preview with debouncing
const debouncedUpdate = debounce(updatePreview, 300);
markdownInput.addEventListener('input', debouncedUpdate);

// Manual refresh
refreshBtn.addEventListener('click', updatePreview);

// Theme switcher
themeSelect.addEventListener('change', function() {
    preview.classList.remove('theme-default', 'theme-github', 'theme-dark');
    preview.classList.add(`theme-${this.value}`);
});

// Toolbar functions
function insertText(before, after = '') {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selectedText = markdownInput.value.substring(start, end);
    const replacement = before + selectedText + after;
    
    markdownInput.value = 
        markdownInput.value.substring(0, start) +
        replacement +
        markdownInput.value.substring(end);
    
    // Set cursor position
    const newPosition = start + before.length + selectedText.length;
    markdownInput.focus();
    markdownInput.setSelectionRange(newPosition, newPosition);
    
    updatePreview();
}

function insertAtCursor(text) {
    const start = markdownInput.selectionStart;
    
    markdownInput.value = 
        markdownInput.value.substring(0, start) +
        text +
        markdownInput.value.substring(start);
    
    const newPosition = start + text.length;
    markdownInput.focus();
    markdownInput.setSelectionRange(newPosition, newPosition);
    
    updatePreview();
}

// Toolbar button handlers
boldBtn.addEventListener('click', () => insertText('**', '**'));
italicBtn.addEventListener('click', () => insertText('*', '*'));
headingBtn.addEventListener('click', () => {
    const start = markdownInput.selectionStart;
    const lineStart = markdownInput.value.lastIndexOf('\n', start - 1) + 1;
    const line = markdownInput.value.substring(lineStart, start);
    
    if (line.trim() === '') {
        insertAtCursor('# ');
    } else {
        markdownInput.value = 
            markdownInput.value.substring(0, lineStart) +
            '# ' +
            markdownInput.value.substring(lineStart);
        markdownInput.setSelectionRange(start + 2, start + 2);
        updatePreview();
    }
});

linkBtn.addEventListener('click', () => {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selectedText = markdownInput.value.substring(start, end);
    
    if (selectedText) {
        insertText('[', '](url)');
    } else {
        insertAtCursor('[text](url)');
    }
});

codeBtn.addEventListener('click', () => {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selectedText = markdownInput.value.substring(start, end);
    
    if (selectedText.includes('\n')) {
        insertText('```\n', '\n```');
    } else {
        insertText('`', '`');
    }
});

listBtn.addEventListener('click', () => insertAtCursor('- '));
quoteBtn.addEventListener('click', () => insertAtCursor('> '));
tableBtn.addEventListener('click', () => {
    const tableTemplate = 
`| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    insertAtCursor(tableTemplate);
});

// Keyboard shortcuts
markdownInput.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'b':
                e.preventDefault();
                boldBtn.click();
                break;
            case 'i':
                e.preventDefault();
                italicBtn.click();
                break;
        }
    }
    
    // Tab support
    if (e.key === 'Tab') {
        e.preventDefault();
        insertAtCursor('    ');
    }
});

// PDF Generation using browser's print functionality
downloadBtn.addEventListener('click', function() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
        alert('Please allow popups to open the print dialog for PDF generation');
        return;
    }
    
    // Get options
    const includeStyles = document.getElementById('includeStyles').checked;
    const pageNumbers = document.getElementById('pageNumbers').checked;
    const paperSize = document.getElementById('paperSize').value;
    const theme = document.getElementById('theme').value;
    
    // Build the print document
    const previewContent = preview.innerHTML;
    
    let printStyles = `
        <style>
            @page {
                size: ${paperSize};
                margin: 20mm;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 100%;
                margin: 0;
                padding: 20px;
            }
            
            ${includeStyles ? getThemeStyles(theme) : ''}
            
            h1 { font-size: 2.5em; margin: 0.5em 0; color: #2c3e50; border-bottom: 3px solid #667eea; padding-bottom: 0.3em; page-break-after: avoid; }
            h2 { font-size: 2em; margin: 0.5em 0; color: #34495e; border-bottom: 2px solid #e0e0e0; padding-bottom: 0.3em; page-break-after: avoid; }
            h3 { font-size: 1.6em; margin: 0.5em 0; color: #34495e; page-break-after: avoid; }
            h4 { font-size: 1.3em; margin: 0.5em 0; color: #34495e; page-break-after: avoid; }
            h5 { font-size: 1.1em; margin: 0.5em 0; color: #34495e; }
            h6 { font-size: 1em; margin: 0.5em 0; color: #34495e; }
            
            p { margin: 1em 0; line-height: 1.7; }
            strong { font-weight: 700; color: #2c3e50; }
            em { font-style: italic; }
            
            code {
                background: #f4f4f4;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                color: #e74c3c;
            }
            
            pre {
                background: #2c3e50;
                color: #ecf0f1;
                padding: 15px;
                border-radius: 6px;
                overflow-x: auto;
                page-break-inside: avoid;
            }
            
            pre code {
                background: none;
                color: inherit;
                padding: 0;
            }
            
            ul, ol { margin: 1em 0; padding-left: 2em; }
            li { margin: 0.5em 0; line-height: 1.6; }
            
            blockquote {
                border-left: 4px solid #667eea;
                padding-left: 1em;
                margin: 1em 0;
                color: #555;
                font-style: italic;
                background: #f9f9f9;
                padding: 1em;
            }
            
            a { color: #667eea; text-decoration: none; }
            img { max-width: 100%; height: auto; margin: 1em 0; }
            hr { border: none; border-top: 2px solid #e0e0e0; margin: 2em 0; }
            
            table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
                page-break-inside: avoid;
            }
            
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            
            th {
                background: #667eea;
                color: white;
                font-weight: 600;
            }
            
            tr:nth-child(even) { background: #f9f9f9; }
            del { text-decoration: line-through; color: #999; }
            
            ${pageNumbers ? `
                @page {
                    @bottom-right {
                        content: "Page " counter(page) " of " counter(pages);
                    }
                }
            ` : ''}
        </style>
    `;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Markdown to PDF</title>
            ${printStyles}
        </head>
        <body>
            ${previewContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
        setTimeout(function() {
            printWindow.print();
            // Note: Don't close the window automatically as user might cancel
        }, 250);
    };
});

function getThemeStyles(theme) {
    const themes = {
        github: `
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
            h1, h2 { border-bottom-color: #eaecef; }
            code { background: #f6f8fa; color: #24292e; }
            pre { background: #f6f8fa; color: #24292e; border: 1px solid #d1d5da; }
        `,
        dark: `
            body { background: #1e1e1e; color: #d4d4d4; }
            h1, h2, h3, h4, h5, h6 { color: #e0e0e0; }
            code { background: #2d2d2d; color: #ce9178; }
            pre { background: #2d2d2d; }
            blockquote { background: #2d2d2d; color: #d4d4d4; }
            table th { background: #404040; }
            table td { border-color: #404040; }
            tr:nth-child(even) { background: #2d2d2d; }
        `,
        default: ''
    };
    
    return themes[theme] || themes.default;
}

// Initialize preview on page load
window.addEventListener('DOMContentLoaded', function() {
    updatePreview();
});

// Save content to localStorage
markdownInput.addEventListener('input', debounce(function() {
    localStorage.setItem('markdownContent', markdownInput.value);
}, 1000));

// Load content from localStorage
window.addEventListener('DOMContentLoaded', function() {
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent && !markdownInput.value) {
        // Only load saved content if the textarea is empty
        if (confirm('Load previously saved content?')) {
            markdownInput.value = savedContent;
            updatePreview();
        }
    }
});
