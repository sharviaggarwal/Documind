import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Bookmark,
  Trash2,
  Copy,
  Check,
  MessageSquare,
} from 'lucide-react';

export const SavedView: React.FC = () => {
  const {
    savedItems,
    removeSavedItem,
    documents,
    selectDocumentAndOpen,
    setActivePageNumber,
  } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenSource = (docId: string, pageNumber: number) => {
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setActivePageNumber(pageNumber);
      selectDocumentAndOpen(doc, 'chat');
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-subtle-grid p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="pb-2 border-b border-cherry/12">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cherry font-bold">
              Personal Notebook
            </span>
            <span className="text-cherry text-xs">✦</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine tracking-tight mt-0.5">
            Saved Citations & Excerpts
          </h2>
          <p className="text-xs text-wine-muted italic mt-0.5">
            Bookmarked passages and verified references saved during reading sessions
          </p>
        </div>

        {savedItems.length === 0 ? (
          <div className="bg-paper rounded-3xl border border-cherry/20 p-12 text-center shadow-paper">
            <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-3 border border-cherry/15">
              <Bookmark className="w-6 h-6 text-cherry/70" />
            </div>
            <h4 className="font-serif text-base font-bold text-wine">No saved excerpts yet</h4>
            <p className="text-xs text-wine-muted max-w-sm mx-auto mt-1 mb-4 font-sans">
              When interrogating documents in the reading notebook, click the bookmark icon to save key passages here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="bg-paper rounded-3xl border border-cherry/20 p-6 shadow-paper hover:border-cherry/40 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="cherry" size="sm" className="font-mono text-[9px] uppercase">
                      Page {item.pageNumber}
                    </Badge>
                    <span className="font-serif text-xs font-bold text-wine">
                      {item.documentName}
                    </span>
                  </div>

                  <span className="text-[11px] text-wine-muted font-mono">
                    {item.savedAt}
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-wine mb-2">
                  {item.title}
                </h3>

                <blockquote className="text-xs text-wine bg-cream/70 p-3.5 rounded-2xl border-l-2 border-cherry italic mb-4 leading-relaxed font-serif">
                  "{item.snippet}"
                </blockquote>

                <div className="flex items-center justify-between pt-2 border-t border-cherry/10 text-xs text-wine-muted">
                  <div className="flex items-center space-x-1.5">
                    {item.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-blush-soft text-cherry border border-cherry/15 font-mono font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(item.id, item.snippet)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-wine-muted hover:text-cherry rounded-lg hover:bg-blush-soft transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="text-emerald-700 font-serif">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="font-serif">Copy</span>
                        </>
                      )}
                    </button>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={<MessageSquare className="w-3 h-3 text-cherry" />}
                      onClick={() => handleOpenSource(item.documentId, item.pageNumber)}
                    >
                      Jump to Volume
                    </Button>

                    <button
                      onClick={() => removeSavedItem(item.id)}
                      className="p-1.5 rounded-lg text-wine-muted hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
