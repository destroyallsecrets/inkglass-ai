'use client';

import { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import { 
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Code, Image, Link, Table, Eye, EyeOff, Download, Save,
  Undo, Redo, FileText, Trash2, Copy, Check
} from 'lucide-react';
import { Page } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const STORAGE_KEY = 'inkglass-markdown-editor';

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  action: string;
  wrap?: [string, string];
}

const toolbarButtons: ToolbarButton[] = [
  { icon: <Bold size={16} />, label: 'Bold', action: 'bold', wrap: ['**', '**'] },
  { icon: <Italic size={16} />, label: 'Italic', action: 'italic', wrap: ['*', '*'] },
  { icon: <Heading1 size={16} />, label: 'Heading 1', action: 'h1', wrap: ['# ', ''] },
  { icon: <Heading2 size={16} />, label: 'Heading 2', action: 'h2', wrap: ['## ', ''] },
  { icon: <Heading3 size={16} />, label: 'Heading 3', action: 'h3', wrap: ['### ', ''] },
  { icon: <List size={16} />, label: 'Bullet List', action: 'ul', wrap: ['- ', ''] },
  { icon: <ListOrdered size={16} />, label: 'Numbered List', action: 'ol', wrap: ['1. ', ''] },
  { icon: <Quote size={16} />, label: 'Quote', action: 'quote', wrap: ['> ', ''] },
  { icon: <Code size={16} />, label: 'Code', action: 'code', wrap: ['`', '`'] },
  { icon: <Link size={16} />, label: 'Link', action: 'link', wrap: ['[', '](url)'] },
  { icon: <Image size={16} />, label: 'Image', action: 'image', wrap: ['![alt](', ')'] },
  { icon: <Table size={16} />, label: 'Table', action: 'table' },
];

export default function MarkdownEditorPage() {
  const [content, setContent] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
      setLastSaved(new Date(saved.length > 0 ? Date.now() : 0));
    } else {
      setContent(getDefaultContent());
    }
  }, []);

  useEffect(() => {
    if (content) {
      localStorage.setItem(STORAGE_KEY, content);
      setLastSaved(new Date());
    }
    try {
      const html = marked.parse(content, { async: false }) as string;
      setPreview(html);
    } catch {
      setPreview('<p>Error parsing markdown</p>');
    }
  }, [content]);

  const getDefaultContent = () => `# Welcome to InkGlass Markdown Editor

Start writing your markdown here. The preview will update in real-time.

## Features

- **Live Preview**: See your formatted text as you type
- **Auto-Save**: Your work is saved automatically
- **Export**: Download as Markdown or HTML
- **Toolbar**: Quick formatting buttons

## Try it out!

Type some markdown or use the toolbar above. You can:

1. Create headings with # signs
2. Make text **bold** or *italic*
3. Add \`inline code\` or code blocks
4. Create [links](https://example.com)
5. Insert images

\`\`\`javascript
// Code blocks with syntax highlighting
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> Blockquotes work great for highlighting important text

| Feature | Status |
|---------|--------|
| Live Preview | ✅ |
| Auto-Save | ✅ |
| Export | ✅ |
`;

  const insertText = useCallback((wrap: [string, string] | undefined) => {
    if (!wrap) return;
    const [before, after] = wrap;
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    addToHistory(newText);
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, [content]);

  const insertTable = useCallback(() => {
    const table = `\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n`;
    insertText(undefined);
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const newText = content + table;
    addToHistory(newText);
    setContent(newText);
  }, [content, insertText]);

  const addToHistory = (newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    addToHistory(newContent);
    setContent(newContent);
  };

  const exportMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHTML = () => {
    const blob = new Blob([preview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearEditor = () => {
    if (confirm('Clear all content? This cannot be undone.')) {
      addToHistory('');
      setContent('');
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const lineCount = content.split('\n').length;

  return (
    <Page>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Markdown Editor</h1>
        <p className="text-muted-foreground mt-1">
          Write and preview markdown with live formatting
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1">
              {toolbarButtons.map((btn) => (
                <Button
                  key={btn.action}
                  variant="ghost"
                  size="icon"
                  title={btn.label}
                  onClick={() => btn.action === 'table' ? insertTable() : insertText(btn.wrap)}
                  className="h-8 w-8"
                >
                  {btn.icon}
                </Button>
              ))}
            </div>

            <div className="h-6 w-px bg-border mx-2" />

            <Button
              variant="ghost"
              size="icon"
              title="Undo"
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="h-8 w-8"
            >
              <Undo size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Redo"
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className="h-8 w-8"
            >
              <Redo size={16} />
            </Button>

            <div className="h-6 w-px bg-border mx-2" />

            <Button
              variant={showPreview ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-8"
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className="ml-1">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </Button>

            <div className="flex-1" />

            <Button
              variant="ghost"
              size="icon"
              title="Copy"
              onClick={copyToClipboard}
              className="h-8 w-8"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Export Markdown"
              onClick={exportMarkdown}
              className="h-8 w-8"
            >
              <Download size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Export HTML"
              onClick={exportHTML}
              className="h-8 w-8"
            >
              <FileText size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Clear"
              onClick={clearEditor}
              className="h-8 w-8"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </Card>

        <div className={`grid gap-4 ${showPreview ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          <Card className="p-0 overflow-hidden">
            <div className="p-3 border-b border-border/50 bg-muted/30">
              <span className="text-sm font-medium">Editor</span>
            </div>
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full h-[500px] p-4 bg-transparent resize-none focus:outline-none font-mono text-sm"
              placeholder="Start writing markdown..."
              spellCheck={false}
            />
          </Card>

          {showPreview && (
            <Card className="p-0 overflow-hidden">
              <div className="p-3 border-b border-border/50 bg-muted/30">
                <span className="text-sm font-medium">Preview</span>
              </div>
              <div 
                className="h-[500px] p-4 overflow-auto prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </Card>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          <span>{lineCount} lines</span>
          {lastSaved && (
            <span className="ml-auto flex items-center gap-1">
              <Save size={12} />
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <style jsx global>{`
        .prose h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.75rem; }
        .prose h2 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .prose h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .prose p { margin-bottom: 1rem; line-height: 1.6; }
        .prose ul, .prose ol { margin-left: 1.5rem; margin-bottom: 1rem; }
        .prose li { margin-bottom: 0.25rem; }
        .prose code { 
          background: rgba(0,0,0,0.1); 
          padding: 0.125rem 0.375rem; 
          border-radius: 0.25rem; 
          font-size: 0.875em;
        }
        .prose pre { 
          background: rgba(0,0,0,0.1); 
          padding: 1rem; 
          border-radius: 0.5rem; 
          overflow-x: auto;
          margin-bottom: 1rem;
        }
        .prose pre code { background: transparent; padding: 0; }
        .prose blockquote { 
          border-left: 4px solid currentColor; 
          padding-left: 1rem; 
          opacity: 0.8;
          margin-bottom: 1rem;
        }
        .prose table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
        .prose th, .prose td { border: 1px solid rgba(0,0,0,0.2); padding: 0.5rem; }
        .prose th { background: rgba(0,0,0,0.1); font-weight: 600; }
        .prose a { color: inherit; text-decoration: underline; }
        .prose img { max-width: 100%; height: auto; border-radius: 0.5rem; }
      `}</style>
    </Page>
  );
}
