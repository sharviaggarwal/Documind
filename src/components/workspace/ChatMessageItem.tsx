import React, { useState } from 'react';
import { Message, Citation } from '../../types';
import { useApp } from '../../context/AppContext';
import { Copy, Check, Bookmark, Sparkles, User, FileText } from 'lucide-react';

interface ChatMessageItemProps {
  message: Message;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const {
    activeCitationId,
    setActiveCitationId,
    setSelectedSource,
    saveItem,
    activeDocument,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToBookmarks = () => {
    if (!activeDocument) return;
    saveItem({
      documentId: activeDocument.id,
      documentName: activeDocument.name,
      title: message.content.slice(0, 48) + '...',
      snippet: message.content.slice(0, 160) + '...',
      pageNumber: message.citations?.[0]?.pageNumber || 1,
      type: 'insight',
      tags: ['Notebook Note', activeDocument.category || 'Document'],
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCitationClick = (citationNum: number) => {
    if (!message.citations) return;
    const matched = message.citations.find((c) => c.sourceNumber === citationNum);
    if (matched) {
      setSelectedSource(matched);
      setActiveCitationId(matched.id);
      const elem = document.getElementById(`source-card-${matched.id}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const renderFormattedContent = (content: string, citations?: Citation[]) => {
    if (!content) return null;

    const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push(renderTextWithCitations(textBefore, `text-${lastIndex}`, citations));
      }

      const lang = match[1] || 'code';
      const codeSnippet = match[2];
      parts.push(
        <div key={`code-${match.index}`} className="my-3 rounded-2xl overflow-hidden border border-wine/40 shadow-paper">
          <div className="bg-wine px-3.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-cream/70 border-b border-wine/50">
            <span>{lang}</span>
            <button
              onClick={() => navigator.clipboard.writeText(codeSnippet)}
              className="hover:text-cream transition-colors cursor-pointer text-xs"
            >
              Copy
            </button>
          </div>
          <pre className="p-3.5 bg-[#3B0F1C] text-blush-soft text-xs font-mono overflow-x-auto leading-relaxed">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(renderTextWithCitations(content.substring(lastIndex), `text-${lastIndex}`, citations));
    }

    return parts;
  };

  const renderTextWithCitations = (text: string, keyPrefix: string, citations?: Citation[]) => {
    const lines = text.split('\n');

    return (
      <div key={keyPrefix} className="space-y-2">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1.5" />;

          // Headings in serif
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-serif text-sm font-bold text-cherry mt-3 mb-1">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="font-serif text-base font-bold text-wine mt-4 mb-1.5">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }

          // Blockquote in warm blush
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="pl-3 py-1.5 my-2 border-l-2 border-cherry bg-blush-soft/70 rounded-r-xl text-xs text-wine italic font-serif leading-relaxed"
              >
                {replaceCitationsInLine(trimmed.replace('> ', ''), citations)}
              </blockquote>
            );
          }

          // Bullet point
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const bulletText = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start space-x-2 text-xs leading-relaxed text-wine pl-1">
                <span className="text-cherry text-sm leading-none shrink-0 mt-0.5">✦</span>
                <div className="flex-1">{replaceCitationsInLine(bulletText, citations)}</div>
              </div>
            );
          }

          // Numbered list
          const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numberedMatch) {
            return (
              <div key={idx} className="flex items-start space-x-2 text-xs leading-relaxed text-wine pl-1">
                <span className="font-serif font-bold text-cherry text-xs shrink-0 font-mono mt-0.5">
                  {numberedMatch[1]}.
                </span>
                <div className="flex-1">{replaceCitationsInLine(numberedMatch[2], citations)}</div>
              </div>
            );
          }

          // Normal paragraph
          return (
            <p key={idx} className="text-xs leading-relaxed text-wine">
              {replaceCitationsInLine(trimmed, citations)}
            </p>
          );
        })}
      </div>
    );
  };

  const replaceCitationsInLine = (line: string, citations?: Citation[]) => {
    const tokenRegex = /(\*\*.*?\*\*|\[\d+\]|\[S\d+\]|\[[^\]]+?\s*\|\s*Page\s*\d+\])/g;
    const parts = line.split(tokenRegex);

    return parts.map((part, i) => {
      const numericMatch = part.match(/^\[S?(\d+)\]$/);
      if (numericMatch) {
        const num = parseInt(numericMatch[1], 10);
        const matchedCitation = citations?.find((c) => c.sourceNumber === num);
        const isHighlighted = matchedCitation && activeCitationId === matchedCitation.id;

        return (
          <button
            key={i}
            onClick={() => handleCitationClick(num)}
            onMouseEnter={() => matchedCitation && setActiveCitationId(matchedCitation.id)}
            className={`inline-flex items-center justify-center px-1.5 py-0.2 mx-0.5 rounded text-[10px] font-bold font-mono transition-all duration-150 cursor-pointer ${
              isHighlighted
                ? 'bg-cherry text-white ring-2 ring-cherry/30 scale-105 shadow-stamp'
                : 'bg-blush-soft hover:bg-blush text-cherry hover:text-wine border border-cherry/25'
            }`}
            title={`Jump to Source ${num}${matchedCitation ? ` (Page ${matchedCitation.pageNumber})` : ''}`}
          >
            [{num}]
          </button>
        );
      }

      const pageMatch = part.match(/^\[([^\]]+?)\s*\|\s*Page\s*(\d+)\]$/);
      if (pageMatch) {
        const pageNum = parseInt(pageMatch[2], 10);
        const matchedCitation = citations?.find((c) => c.pageNumber === pageNum);
        const isHighlighted = matchedCitation && activeCitationId === matchedCitation.id;

        return (
          <button
            key={i}
            onClick={() => {
              if (matchedCitation) {
                setSelectedSource(matchedCitation);
                setActiveCitationId(matchedCitation.id);
                const elem = document.getElementById(`source-card-${matchedCitation.id}`);
                if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }}
            onMouseEnter={() => matchedCitation && setActiveCitationId(matchedCitation.id)}
            className={`inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 rounded text-[10px] font-bold font-mono transition-all duration-150 cursor-pointer ${
              isHighlighted
                ? 'bg-cherry text-white ring-2 ring-cherry/30 scale-105 shadow-stamp'
                : 'bg-blush-soft hover:bg-blush text-cherry hover:text-wine border border-cherry/25'
            }`}
            title={`Jump to ${pageMatch[1]} (Page ${pageNum})`}
          >
            {part}
          </button>
        );
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-wine font-sans">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
  };

  return (
    <div
      className={`group flex items-start space-x-3 py-3 px-4 rounded-2xl transition-all duration-150 ${
        isUser
          ? 'bg-blush-soft border border-blush ml-6 sm:ml-12 shadow-2xs'
          : 'bg-paper border border-cherry/18 shadow-paper mr-2 sm:mr-8'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          isUser
            ? 'bg-blush text-wine border border-cherry/20 shadow-2xs font-serif font-bold text-xs'
            : 'bg-cherry text-white shadow-2xs'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5 text-wine" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-hidden min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-xs font-bold text-wine">
              {isUser ? 'You' : 'DocuMind Reader'}
            </span>
            <span className="text-[10px] text-wine-muted font-mono">
              {message.timestamp}
            </span>
          </div>

          {!isUser && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 rounded-md text-wine-muted hover:text-cherry hover:bg-blush-soft transition-colors cursor-pointer"
                title="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleSaveToBookmarks}
                className="p-1 rounded-md text-wine-muted hover:text-cherry hover:bg-blush-soft transition-colors cursor-pointer"
                title="Save excerpt"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-cherry" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Loading typing indicator or Content */}
        {message.isLoading && !message.content ? (
          <div className="flex items-center space-x-2 py-2 text-xs text-wine-muted font-serif italic">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-cherry rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-cherry rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-cherry rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span>Cross-referencing document passages...</span>
          </div>
        ) : (
          <div className="prose-documind">
            {renderFormattedContent(message.content, message.citations)}
          </div>
        )}

        {/* Citations Footer Chips */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-3.5 pt-2.5 border-t border-cherry/10 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-serif uppercase tracking-wider text-wine-muted font-bold mr-1 flex items-center">
              <FileText className="w-3 h-3 mr-1 text-cherry" />
              Cited Passages:
            </span>
            {message.citations.map((cit) => {
              const isSelected = activeCitationId === cit.id;
              return (
                <button
                  key={cit.id}
                  onClick={() => handleCitationClick(cit.sourceNumber)}
                  onMouseEnter={() => setActiveCitationId(cit.id)}
                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cherry text-white font-bold shadow-2xs'
                      : 'bg-cream hover:bg-blush-soft text-wine border border-cherry/20'
                  }`}
                >
                  <span className="font-mono">[{cit.sourceNumber}]</span>
                  <span className="font-serif">Page {cit.pageNumber}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
