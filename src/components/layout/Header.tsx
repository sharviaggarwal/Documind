import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import {
  FileText,
  Upload,
  ChevronDown,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    activeDocument,
    documents,
    setActiveDocument,
    setIsUploadModalOpen,
    setActiveView,
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    switch (activeView) {
      case 'home':
        return { title: 'The Reading Room', sub: 'Your intelligent editorial workspace for documents' };
      case 'documents':
        return { title: 'Document Archive', sub: `${documents.length} volumes indexed and cross-referenced` };
      case 'chat':
        return { title: 'Reading Notebook', sub: 'Ask questions, review citations, and verify claims' };
      case 'insights':
        return { title: 'Inside this Document', sub: 'Curated summaries, key concepts, and structural outline' };
      case 'saved':
        return { title: 'Saved Excerpts', sub: 'Bookmarked passages and verified citations' };
      case 'settings':
        return { title: 'Notebook Settings', sub: 'Fine-tune model reasoning, retrieval chunks, and thresholds' };
    }
  };

  const { title, sub } = getTitle();

  return (
    <header className="h-16 border-b border-cherry/12 bg-cream/90 backdrop-blur-xs px-6 flex items-center justify-between shrink-0 z-10">
      {/* Title & Context */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="font-serif text-lg font-bold text-wine tracking-tight flex items-center space-x-2">
            <span>{title}</span>
            <span className="text-cherry text-xs">✦</span>
          </h1>
          <p className="text-xs text-wine-muted font-sans hidden sm:block italic">
            {sub}
          </p>
        </div>

        {/* Document Selector Dropdown (Shown in Chat & Insights) */}
        {(activeView === 'chat' || activeView === 'insights') && (
          <div className="relative ml-3" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-paper hover:bg-cream border border-cherry/20 rounded-xl text-xs font-medium text-wine transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-cherry" />
              <span className="max-w-[170px] truncate font-medium">
                {activeDocument ? activeDocument.name : 'Select volume...'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-wine-muted" />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-72 bg-paper rounded-2xl border border-cherry/20 py-2 z-30 shadow-paper-lift animate-fade-in">
                <div className="px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest text-wine-muted">
                  Choose Document
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-cherry/5">
                  {documents.map((doc) => {
                    const isSelected = activeDocument?.id === doc.id;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setActiveDocument(doc);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-cream transition-colors text-xs cursor-pointer ${
                          isSelected ? 'bg-blush-soft text-cherry font-semibold' : 'text-wine'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-wine-muted shrink-0" />
                          <span className="truncate">{doc.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cherry shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-cherry/10 mt-1 pt-1.5 px-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsUploadModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 text-xs font-semibold text-cherry hover:bg-blush-soft rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Document</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-3">
        {activeView === 'chat' && activeDocument && (
          <button
            onClick={() => setActiveView('insights')}
            className="hidden md:flex items-center space-x-1.5 text-xs font-semibold text-wine-muted hover:text-cherry px-3 py-1.5 rounded-xl hover:bg-blush-soft transition-colors border border-cherry/15 bg-paper/60 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cherry" />
            <span>Document Insights</span>
            <ExternalLink className="w-3 h-3 text-wine-muted" />
          </button>
        )}

        <Button
          variant="primary"
          size="sm"
          icon={<Upload className="w-3.5 h-3.5" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      </div>
    </header>
  );
};
