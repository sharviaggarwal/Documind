import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { FileText, Clock, Layers, ArrowUpRight, Paperclip } from 'lucide-react';
import { Document } from '../../types';

export const RecentDocuments: React.FC = () => {
  const { documents, selectDocumentAndOpen, setActiveView } = useApp();

  const handleOpenDoc = (doc: Document) => {
    selectDocumentAndOpen(doc, 'chat');
  };

  return (
    <section className="mt-4 mb-16">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-cherry/12">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cherry font-bold">
            Archival Shelf
          </span>
          <h2 className="font-serif text-2xl font-bold text-wine tracking-tight mt-0.5">
            Recent Documents
          </h2>
          <p className="text-xs text-wine-muted italic mt-0.5">
            Pick up your reading bookmark or inspect newly indexed volumes
          </p>
        </div>
        <button
          onClick={() => setActiveView('documents')}
          className="text-xs font-semibold text-cherry hover:text-cherry-dark flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <span>View all volumes ({documents.length})</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.slice(0, 3).map((doc, idx) => (
          <div
            key={doc.id}
            onClick={() => handleOpenDoc(doc)}
            className="group cursor-pointer bg-paper rounded-2xl border border-cherry/20 p-5 hover:border-cherry/50 hover:shadow-paper-lift transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Washi tape strip decoration on top */}
            <div
              className={`absolute top-0 inset-x-8 h-1 ${
                idx % 2 === 0 ? 'bg-blush' : 'bg-lavender'
              } opacity-90 rounded-b-sm`}
            />

            <div>
              {/* Header row: PDF Icon + Category Badge */}
              <div className="flex items-start justify-between mb-3.5 pt-1">
                <div className="w-10 h-10 rounded-xl bg-blush-soft text-cherry flex items-center justify-center border border-cherry/20 shadow-2xs group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 stroke-[1.8]" />
                </div>
                <Badge variant={idx === 0 ? 'cherry' : idx === 1 ? 'blush' : 'lavender'} size="sm">
                  {doc.category || doc.fileType}
                </Badge>
              </div>

              {/* Document Name in Serif */}
              <h3 className="font-serif text-sm font-bold text-wine line-clamp-1 mb-1.5 group-hover:text-cherry transition-colors">
                {doc.name}
              </h3>

              {/* Summary */}
              <p className="text-xs text-wine-muted line-clamp-2 leading-relaxed mb-4 font-sans">
                {doc.summary}
              </p>
            </div>

            {/* Bottom Meta & Open Button */}
            <div className="pt-3 border-t border-cherry/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 text-[11px] text-wine-muted font-mono">
                  <Layers className="w-3 h-3 text-cherry" />
                  <span>{doc.pageCount} pages</span>
                  <span>•</span>
                  <span>{doc.fileSizeFormatted}</span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-wine-muted/70 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{doc.lastOpened}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="group-hover:bg-cherry group-hover:text-white group-hover:border-cherry transition-all text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDoc(doc);
                }}
              >
                Open
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
