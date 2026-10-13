import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessageItem } from './ChatMessageItem';
import {
  Send,
  Paperclip,
  Sparkles,
  FileQuestion,
  CornerDownLeft,
} from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const {
    chatMessages,
    sendMessage,
    isStreaming,
    activeDocument,
    setIsUploadModalOpen,
  } = useApp();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isStreaming]);

  const getSuggestedQuestions = () => {
    if (!activeDocument) return [];
    if (activeDocument.id === 'doc-1') {
      return [
        'What was the Q3 revenue growth and operating margin?',
        'How much did Enterprise SaaS ARR expand YoY?',
        'What are the forward-looking guidance projections for Q4?',
      ];
    }
    if (activeDocument.id === 'doc-2') {
      return [
        'What are the mandatory Human-in-the-Loop escalation thresholds?',
        'How does the blueprint comply with the EU AI Act?',
        'What automated red-teaming protocols are implemented?',
      ];
    }
    if (activeDocument.id === 'doc-3') {
      return [
        'What are the target recovery metrics (RPO & RTO)?',
        'How does database replication handle failover?',
        'What security protections are provided by eBPF?',
      ];
    }
    return [
      `Summarize the executive conclusions in ${activeDocument.name}`,
      'What are the core technical or operational requirements?',
      'Are there specific risk factors or compliance mandates?',
    ];
  };

  const suggestedQuestions = getSuggestedQuestions();

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const handleChipClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-subtle-grid relative overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-10">
            <div className="w-12 h-12 rounded-2xl bg-blush-soft text-cherry flex items-center justify-center mb-3 shadow-2xs border border-cherry/20">
              <Sparkles className="w-6 h-6 stroke-[1.8]" />
            </div>

            <h3 className="font-serif text-xl font-bold text-wine mb-1.5">
              Ask anything about {activeDocument?.name || 'this volume'}
            </h3>
            <p className="text-xs text-wine-muted mb-6 leading-relaxed font-sans max-w-sm">
              Every question is cross-referenced against vector embeddings, producing verified answers with exact page citations.
            </p>

            {/* Empty state suggestions */}
            <div className="w-full space-y-2 text-left">
              <div className="text-[10px] font-mono uppercase tracking-widest text-cherry font-bold px-1">
                Suggested Questions to Explore
              </div>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(q)}
                  className="w-full p-3 bg-paper hover:bg-cream border border-cherry/20 hover:border-cherry/50 rounded-2xl text-xs text-wine text-left transition-all flex items-center justify-between group shadow-paper cursor-pointer"
                >
                  <span className="line-clamp-1 font-serif">{q}</span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-cherry shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Suggested Questions Quick Chips */}
      {chatMessages.length > 0 && suggestedQuestions.length > 0 && (
        <div className="px-6 py-2 overflow-x-auto flex items-center space-x-2 border-t border-cherry/10 bg-paper/80 backdrop-blur-xs shrink-0">
          <div className="text-[10px] uppercase font-mono font-bold text-cherry tracking-wider flex items-center shrink-0">
            <FileQuestion className="w-3 h-3 mr-1 text-cherry" />
            Try:
          </div>
          {suggestedQuestions.slice(0, 3).map((q, idx) => (
            <button
              key={idx}
              disabled={isStreaming}
              onClick={() => handleChipClick(q)}
              className="text-[11px] whitespace-nowrap bg-cream hover:bg-blush-soft text-wine hover:text-cherry px-3 py-1 rounded-full border border-cherry/20 transition-colors shadow-2xs shrink-0 disabled:opacity-50 cursor-pointer font-serif"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Container */}
      <div className="p-4 sm:p-5 bg-paper border-t border-cherry/15 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-cream/70 border border-cherry/25 focus-within:border-cherry focus-within:ring-2 focus-within:ring-cherry/15 rounded-2xl shadow-paper transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about this document…"
              disabled={isStreaming}
              className="w-full bg-transparent px-4 pt-3.5 pb-11 text-xs sm:text-sm text-wine placeholder:text-wine-muted/60 focus:outline-none resize-none font-sans"
            />

            {/* Input Toolbar */}
            <div className="absolute left-3 right-3 bottom-2 flex items-center justify-between pointer-events-none">
              <div className="flex items-center space-x-1 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="p-1.5 rounded-lg text-wine-muted hover:text-cherry hover:bg-blush-soft transition-colors cursor-pointer"
                  title="Attach or switch document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-wine-muted font-serif italic hidden sm:inline">
                  {activeDocument ? activeDocument.name : 'No volume selected'}
                </span>
              </div>

              <div className="flex items-center space-x-2 pointer-events-auto">
                <span className="text-[10px] text-wine-muted hidden sm:inline font-mono">
                  ↵ to send
                </span>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  className="w-8 h-8 rounded-xl bg-cherry hover:bg-cherry-dark disabled:bg-cream disabled:text-wine-muted/40 text-white flex items-center justify-center transition-all duration-150 shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Send query"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
