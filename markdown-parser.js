/**
 * Comprehensive Markdown Parser
 * Converts Markdown to HTML with support for:
 * - Headers, Bold, Italic, Strikethrough
 * - Lists (ordered and unordered)
 * - Code blocks and inline code
 * - Blockquotes
 * - Links and Images
 * - Tables
 * - Horizontal rules
 */

class MarkdownParser {
    constructor() {
        this.rules = this.initializeRules();
    }

    initializeRules() {
        return [
            // Headers (must be at start of line)
            { pattern: /^######\s+(.+)$/gm, replacement: '<h6>$1</h6>' },
            { pattern: /^#####\s+(.+)$/gm, replacement: '<h5>$1</h5>' },
            { pattern: /^####\s+(.+)$/gm, replacement: '<h4>$1</h4>' },
            { pattern: /^###\s+(.+)$/gm, replacement: '<h3>$1</h3>' },
            { pattern: /^##\s+(.+)$/gm, replacement: '<h2>$1</h2>' },
            { pattern: /^#\s+(.+)$/gm, replacement: '<h1>$1</h1>' },
        ];
    }

    parse(markdown) {
        if (!markdown || markdown.trim() === '') {
            return '<p>Start typing to see preview...</p>';
        }

        let html = markdown;

        // Escape HTML entities first
        html = this.escapeHtml(html);

        // Process code blocks first (to protect from other conversions)
        html = this.parseCodeBlocks(html);

        // Process tables
        html = this.parseTables(html);

        // Process blockquotes
        html = this.parseBlockquotes(html);

        // Process horizontal rules
        html = html.replace(/^(\s*[-*_]){3,}\s*$/gm, '<hr>');

        // Process headers
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replacement);
        });

        // Process lists
        html = this.parseLists(html);

        // Process inline elements
        html = this.parseInlineElements(html);

        // Process paragraphs (must be done last)
        html = this.parseParagraphs(html);

        // Restore code blocks
        html = this.restoreCodeBlocks(html);

        return html;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        // Store code blocks before escaping
        this.codeBlocks = [];
        const self = this;
        
        // Temporarily replace code blocks
        text = text.replace(/```([\s\S]*?)```/g, function(match) {
            self.codeBlocks.push(match);
            return `§§§CODEBLOCK${self.codeBlocks.length - 1}§§§`;
        });
        
        // Temporarily replace inline code
        this.inlineCodes = [];
        text = text.replace(/`([^`]+)`/g, function(match) {
            self.inlineCodes.push(match);
            return `§§§INLINECODE${self.inlineCodes.length - 1}§§§`;
        });
        
        return text;
    }

    parseCodeBlocks(text) {
        const self = this;
        this.processedCodeBlocks = [];
        
        text = text.replace(/§§§CODEBLOCK(\d+)§§§/g, function(match, index) {
            let block = self.codeBlocks[parseInt(index)];
            // Extract language and code
            const codeMatch = block.match(/```(\w+)?\n?([\s\S]*?)```/);
            if (codeMatch) {
                const language = codeMatch[1] || '';
                const code = codeMatch[2];
                const blockIndex = self.processedCodeBlocks.length;
                const placeholder = `§§§PROCESSEDCODE${blockIndex}§§§`;
                self.processedCodeBlocks.push(`<pre><code class="language-${language}">${code}</code></pre>`);
                return placeholder;
            }
            return match;
        });
        
        return text;
    }

    restoreCodeBlocks(text) {
        const self = this;
        
        // Restore processed code blocks
        text = text.replace(/§§§PROCESSEDCODE(\d+)§§§/g, function(match, index) {
            return self.processedCodeBlocks[parseInt(index)] || match;
        });
        
        // Restore inline code
        text = text.replace(/§§§INLINECODE(\d+)§§§/g, function(match, index) {
            const code = self.inlineCodes[parseInt(index)];
            const codeContent = code.replace(/`([^`]+)`/, '$1');
            return `<code>${codeContent}</code>`;
        });
        
        return text;
    }

    parseTables(text) {
        // Simple table parser
        const lines = text.split('\n');
        const result = [];
        let inTable = false;
        let tableLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check if this is a table line
            if (line.trim().match(/^\|(.+)\|$/)) {
                if (!inTable) {
                    inTable = true;
                    tableLines = [];
                }
                tableLines.push(line);
            } else {
                if (inTable) {
                    // End of table, process it
                    result.push(this.processTable(tableLines));
                    inTable = false;
                    tableLines = [];
                }
                result.push(line);
            }
        }

        // Handle table at end of document
        if (inTable) {
            result.push(this.processTable(tableLines));
        }

        return result.join('\n');
    }

    processTable(lines) {
        if (lines.length < 2) return lines.join('\n');

        const headerLine = lines[0];
        const separatorLine = lines[1];
        
        // Check if second line is separator
        if (!separatorLine.match(/^\|[\s:|-]+\|$/)) {
            return lines.join('\n');
        }

        const dataLines = lines.slice(2);
        
        // Parse header
        const headers = headerLine.split('|').slice(1, -1).map(h => h.trim());
        
        // Build table HTML
        let html = '<table>\n<thead>\n<tr>\n';
        headers.forEach(header => {
            html += `<th>${header}</th>\n`;
        });
        html += '</tr>\n</thead>\n<tbody>\n';
        
        // Parse data rows
        dataLines.forEach(line => {
            const cells = line.split('|').slice(1, -1).map(c => c.trim());
            html += '<tr>\n';
            cells.forEach(cell => {
                html += `<td>${cell}</td>\n`;
            });
            html += '</tr>\n';
        });
        
        html += '</tbody>\n</table>';
        return html;
    }

    parseBlockquotes(text) {
        const lines = text.split('\n');
        const result = [];
        let inBlockquote = false;
        let blockquoteLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.trim().startsWith('>')) {
                if (!inBlockquote) {
                    inBlockquote = true;
                    blockquoteLines = [];
                }
                blockquoteLines.push(line.replace(/^\s*>\s?/, ''));
            } else {
                if (inBlockquote) {
                    result.push('<blockquote>' + blockquoteLines.join('\n') + '</blockquote>');
                    inBlockquote = false;
                    blockquoteLines = [];
                }
                result.push(line);
            }
        }

        if (inBlockquote) {
            result.push('<blockquote>' + blockquoteLines.join('\n') + '</blockquote>');
        }

        return result.join('\n');
    }

    parseLists(text) {
        const lines = text.split('\n');
        const result = [];
        let inList = false;
        let listType = null;
        let listItems = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const unorderedMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
            const orderedMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);

            if (unorderedMatch || orderedMatch) {
                const currentType = unorderedMatch ? 'ul' : 'ol';
                const content = unorderedMatch ? unorderedMatch[1] : orderedMatch[1];

                if (!inList) {
                    inList = true;
                    listType = currentType;
                    listItems = [];
                } else if (listType !== currentType) {
                    // Close previous list and start new one
                    result.push(this.buildList(listType, listItems));
                    listType = currentType;
                    listItems = [];
                }
                
                listItems.push(content);
            } else {
                if (inList) {
                    result.push(this.buildList(listType, listItems));
                    inList = false;
                    listType = null;
                    listItems = [];
                }
                result.push(line);
            }
        }

        if (inList) {
            result.push(this.buildList(listType, listItems));
        }

        return result.join('\n');
    }

    buildList(type, items) {
        let html = `<${type}>\n`;
        items.forEach(item => {
            html += `<li>${item}</li>\n`;
        });
        html += `</${type}>`;
        return html;
    }

    parseInlineElements(text) {
        // Bold and italic (must check bold+italic first)
        text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        text = text.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
        
        // Bold
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Italic
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');
        
        // Strikethrough
        text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
        
        // Links [text](url)
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Images ![alt](url)
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
        
        return text;
    }

    parseParagraphs(text) {
        // Split by double newlines to identify paragraphs
        const blocks = text.split(/\n\n+/);
        const result = [];

        blocks.forEach(block => {
            block = block.trim();
            if (!block) return;
            
            // Skip if already an HTML block element
            if (block.match(/^<(h[1-6]|table|ul|ol|blockquote|pre|hr)/)) {
                result.push(block);
            } else {
                // Wrap in paragraph tags
                result.push(`<p>${block.replace(/\n/g, '<br>')}</p>`);
            }
        });

        return result.join('\n');
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownParser;
}
