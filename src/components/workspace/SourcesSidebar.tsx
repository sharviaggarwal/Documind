import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Citation } from '../../types';
import {
  FileText,
  Bookmark,
  Copy,
  Check,
  Maximize2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const SourcesSidebar: React.FC = () => {
  const {
    chatMessages,
    activeCitationId,
    setActiveCitationId,
    activeDocument,
    setActivePageNumber,
    saveItem,
  } = useApp();

  const [expandedCitation, setExpandedCitation] = useState<Citation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const latestAssistantMessage = [...chatMessages]
    .reverse()
    .find((m) => m.role === 'assistant' && m.citations && m.citations.length > 0);

  const citations: Citation[] = latestAssistantMessage?.citations || [];

  const handleCopyPassage = (cit: Citation, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`"${cit.snippet}" — ${activeDocument?.name}, Page ${cit.pageNumber}`);
    setCopiedId(cit.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveCitation = (cit: Citation, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeDocument) return;
    saveItem({
      documentId: activeDocument.id,
      documentName: activeDocument.name,
      title: `Source ${cit.sourceNumber}: ${cit.sectionHeading}`,
      snippet: cit.snippet,
      pageNumber: cit.pageNumber,
      type: 'citation',
      tags: ['Citation', `Page ${cit.pageNumber}`],
    });
    setSavedId(cit.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const handleCardClick = (cit: Citation) => {
    setActiveCitationId(cit.id);
    setActivePageNumber(cit.pageNumber);
  };

  return (
    <aside className="w-80 h-full bg-paper border-l border-cherry/15 flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-cherry/10 flex items-center justify-between bg-cream/50">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-serif text-sm font-bold text-wine tracking-tight">Sources</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blush text-cherry border border-cherry/20">
              {citations.length} cited
            </span>
          </div>
          <p className="text-[11px] text-wine-muted mt-0.5 font-serif italic">
            Grounded vector references for answer
          </p>
        </div>
        <span className="text-cherry text-xs">✦</span>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {citations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-wine-muted">
            <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center mb-3 border border-cherry/15">
              <FileText className="w-6 h-6 text-cherry/70" />
            </div>
            <h4 className="font-serif text-sm font-bold text-wine mb-1">
              No sources cited yet
            </h4>
            <p className="text-[11px] text-wine-muted leading-relaxed max-w-[200px] font-sans">
              Ask a question about this volume in the reading notebook to review verbatim source passages.
            </p>
          </div>
        ) : (
          citations.map((citation) => {
            const isHighlighted = activeCitationId === citation.id;
            const scorePct = Math.round(citation.similarityScore * 100);

            return (
              <div
                id={`source-card-${citation.id}`}
                key={citation.id}
                onClick={() => handleCardClick(citation)}
                className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 relative ${
                  isHighlighted
                    ? 'border-cherry bg-blush-soft/80 ring-2 ring-cherry/20 shadow-paper-lift scale-[1.01]'
                    : 'border-cherry/15 hover:border-cherry/40 hover:shadow-paper bg-paper'
                }`}
              >
                {/* Washi tape accent on card */}
                <div className="absolute top-0 right-6 w-10 h-1.5 bg-lavender/80 rounded-b" />

                {/* Top: SOURCE XX + PAGE YY in bold editorial typography */}
                <div className="flex items-baseline justify-between mb-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cherry font-bold block">
                      SOURCE {citation.sourceNumber < 10 ? `0${citation.sourceNumber}` : citation.sourceNumber}
                    </span>
                    <span className="font-serif text-base font-bold text-wine tracking-tight block">
                      PAGE {citation.pageNumber}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cream border border-cherry/15 text-wine-muted font-semibold">
                    {scorePct}% match
                  </span>
                </div>

                {/* Section Heading */}
                <div className="text-xs font-semibold text-wine mb-2 line-clamp-1 font-sans">
                  {citation.sectionHeading}
                </div>

                {/* Relevant Passage Quote */}
                <blockquote className="text-xs text-wine-muted leading-relaxed italic bg-cream/60 p-3 rounded-xl border-l-2 border-cherry mb-3 line-clamp-3 font-serif">
                  "{citation.snippet}"
                </blockquote>

                {/* Card Action Bar */}
                <div className="pt-2 border-t border-cherry/10 flex items-center justify-between text-xs text-wine-muted">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCitation(citation);
                    }}
                    className="flex items-center space-x-1 hover:text-cherry transition-colors cursor-pointer text-[11px] font-medium"
                  >
                    <Maximize2 className="w-3 h-3 text-cherry" />
                    <span>Expand passage</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleCopyPassage(citation, e)}
                      className="p-1 rounded hover:bg-blush-soft text-wine-muted hover:text-cherry transition-colors cursor-pointer"
                      title="Copy passage"
                    >
                      {copiedId === citation.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleSaveCitation(citation, e)}
                      className="p-1 rounded hover:bg-blush-soft text-wine-muted hover:text-cherry transition-colors cursor-pointer"
                      title="Bookmark citation"
                    >
                      {savedId === citation.id ? (
                        <Check className="w-3.5 h-3.5 text-cherry" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Expanded Passage Modal */}
      {expandedCitation && (
        <Modal
          isOpen={!!expandedCitation}
          onClose={() => setExpandedCitation(null)}
          title={`SOURCE 0${expandedCitation.sourceNumber} — PAGE ${expandedCitation.pageNumber}`}
          description={`${activeDocument?.name} • ${expandedCitation.sectionHeading}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-5 bg-cream/60 rounded-2xl border border-cherry/15 leading-relaxed text-sm text-wine font-serif shadow-2xs">
              "{expandedCitation.fullPassage}"
            </div>

            <div className="flex items-center justify-between text-xs text-wine-muted pt-2 border-t border-cherry/10">
              <span className="font-mono text-[11px]">
                Vector Similarity: {Math.round(expandedCitation.similarityScore * 100)}%
              </span>
              <button
                onClick={() => {
                  setActivePageNumber(expandedCitation.pageNumber);
                  setExpandedCitation(null);
                }}
                className="text-cherry hover:text-cherry-dark font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <span>Navigate to Page {expandedCitation.pageNumber}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </aside>
  );
};
