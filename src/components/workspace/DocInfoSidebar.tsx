import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  FileText,
  Plus,
  BookOpen,
  ChevronRight,
  BookmarkCheck,
  Paperclip,
  Layers,
} from 'lucide-react';

export const DocInfoSidebar: React.FC = () => {
  const {
    activeDocument,
    setIsUploadModalOpen,
    activePageNumber,
    setActivePageNumber,
  } = useApp();

  if (!activeDocument) {
    return (
      <div className="w-64 h-full bg-paper border-r border-cherry/15 p-4 flex flex-col items-center justify-center text-center">
        <FileText className="w-8 h-8 text-wine-muted/50 mb-2" />
        <p className="text-xs text-wine-muted">No document selected</p>
      </div>
    );
  }

  return (
    <aside className="w-72 h-full bg-paper border-r border-cherry/15 flex flex-col shrink-0 overflow-hidden">
      {/* Top Document Header */}
      <div className="p-4 border-b border-cherry/10 bg-cream/50 relative">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blush-soft text-cherry flex items-center justify-center shrink-0 border border-cherry/20 shadow-2xs">
            <FileText className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div className="truncate flex-1">
            <h2 className="font-serif text-xs font-bold text-wine truncate leading-snug" title={activeDocument.name}>
              {activeDocument.name}
            </h2>
            <div className="flex items-center space-x-2 mt-0.5 font-mono text-[11px] text-wine-muted">
              <span>{activeDocument.pageCount} pages</span>
              <span>•</span>
              <span>{activeDocument.fileSizeFormatted}</span>
            </div>
          </div>
        </div>

        {/* Status Pill & Action */}
        <div className="flex items-center justify-between pt-1">
          <Badge variant="cherry" size="sm" className="gap-1 font-mono uppercase text-[9px]">
            <BookmarkCheck className="w-3 h-3 text-white" />
            <span>Indexed</span>
          </Badge>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-cherry hover:text-cherry-dark hover:bg-blush-soft/70 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Volume</span>
          </button>
        </div>
      </div>

      {/* Page Navigation Header */}
      <div className="px-4 py-2.5 bg-cream/70 border-b border-cherry/10 flex items-center justify-between text-xs text-wine font-medium">
        <div className="flex items-center space-x-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cherry" />
          <span className="font-serif font-bold">Table of Contents</span>
        </div>
        <span className="text-[11px] text-wine-muted font-mono">
          Page {activePageNumber} of {activeDocument.pageCount}
        </span>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeDocument.pages.map((page) => {
          const isSelected = activePageNumber === page.pageNumber;

          return (
            <div
              key={page.pageNumber}
              onClick={() => setActivePageNumber(page.pageNumber)}
              className={`group cursor-pointer rounded-2xl border p-3 transition-all duration-150 relative ${
                isSelected
                  ? 'border-cherry bg-blush-soft/80 shadow-2xs ring-1 ring-cherry/20'
                  : 'border-cherry/15 hover:border-cherry/35 hover:bg-cream/60 bg-paper'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 text-cherry text-xs">
                  ✦
                </div>
              )}

              <div className="flex items-center justify-between mb-1.5 pr-4">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center font-mono ${
                      isSelected
                        ? 'bg-cherry text-white shadow-2xs'
                        : 'bg-cream text-wine group-hover:bg-blush'
                    }`}
                  >
                    {page.pageNumber}
                  </span>
                  <span className="font-serif text-xs font-bold text-wine line-clamp-1">
                    {page.headings[0] || `Section ${page.pageNumber}`}
                  </span>
                </div>
              </div>

              {/* Snippet preview on cream paper */}
              <p className="text-[11px] text-wine-muted line-clamp-2 leading-relaxed pl-8 font-sans">
                {page.preview || page.snippet}
              </p>
            </div>
          );
        })}

        {activeDocument.pageCount > activeDocument.pages.length && (
          <div className="p-3 text-center bg-cream/50 rounded-2xl border border-dashed border-cherry/20 text-xs text-wine-muted font-hand text-sm">
            <span>+ {activeDocument.pageCount - activeDocument.pages.length} additional pages indexed in docket</span>
          </div>
        )}
      </div>
    </aside>
  );
};
