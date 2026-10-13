import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import {
  FileText,
  Upload,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeDocument,
    documents,
    setActiveDocument,
    setIsUploadModalOpen,
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

  return (
    <header className="h-14 border-b border-cherry/12 bg-cream/90 backdrop-blur-xs px-6 flex items-center justify-between shrink-0 z-10 font-sans">
      {/* Title & Document Info */}
      <div className="flex items-center space-x-3 truncate">
        {activeDocument ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blush-soft text-cherry flex items-center justify-center border border-cherry/20 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h1 className="font-serif text-sm font-bold text-wine tracking-tight truncate">
                {activeDocument.name}
              </h1>
              <p className="text-[11px] text-wine-muted font-mono">
                {activeDocument.pageCount} pages • Grounded vector retrieval
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="font-serif text-base font-bold text-wine tracking-tight flex items-center space-x-2">
              <span>DocuMind Reading Room</span>
              <span className="text-cherry text-xs">✦</span>
            </h1>
            <p className="text-xs text-wine-muted font-serif italic hidden sm:block">
              Upload a document to begin questioning
            </p>
          </div>
        )}

        {/* Document Selector Dropdown if multiple docs exist */}
        {documents.length > 1 && (
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-paper hover:bg-cream border border-cherry/20 rounded-lg text-xs font-medium text-wine transition-colors shadow-2xs cursor-pointer"
            >
              <span className="text-cherry font-bold text-[10px] uppercase font-mono">Switch</span>
              <ChevronDown className="w-3 h-3 text-wine-muted" />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-paper rounded-xl border border-cherry/20 py-1.5 z-30 shadow-paper-lift animate-fade-in">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-wine-muted border-b border-cherry/10">
                  Select Document
                </div>
                <div className="max-h-52 overflow-y-auto divide-y divide-cherry/5">
                  {documents.map((doc) => {
                    const isSelected = activeDocument?.id === doc.id;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setActiveDocument(doc);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-cream transition-colors text-xs cursor-pointer ${
                          isSelected ? 'bg-blush-soft text-cherry font-semibold' : 'text-wine'
                        }`}
                      >
                        <span className="truncate">{doc.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cherry shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-3">
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
