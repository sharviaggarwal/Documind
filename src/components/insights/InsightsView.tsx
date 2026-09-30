import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { insightsService } from '../../services/insightsService';
import { InsightData } from '../../types';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  BookOpen,
  Hash,
  Clock,
  Layers,
  HelpCircle,
  ArrowRight,
  FolderTree,
  Lightbulb,
  FileText,
  Copy,
  Check,
  Bookmark,
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { activeDocument, sendMessage, setActiveView } = useApp();
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    if (!activeDocument) {
      setInsights(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    insightsService.getInsights(activeDocument).then((data) => {
      if (isMounted) {
        setInsights(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeDocument]);

  const handleAskQuestion = (question: string) => {
    setActiveView('chat');
    sendMessage(question);
  };

  const handleCopySummary = () => {
    if (!insights) return;
    navigator.clipboard.writeText(insights.executiveSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  if (!activeDocument) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-subtle-grid">
        <div className="w-12 h-12 rounded-2xl bg-paper flex items-center justify-center mb-3 border border-cherry/20 shadow-2xs">
          <BookOpen className="w-6 h-6 text-cherry" />
        </div>
        <h3 className="font-serif text-lg font-bold text-wine mb-1">No Document Selected</h3>
        <p className="text-xs text-wine-muted max-w-sm mb-4">
          Select or upload a document to generate an editorial intelligence report.
        </p>
      </div>
    );
  }

  if (isLoading || !insights) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-subtle-grid space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-cherry border-t-transparent animate-spin" />
        <p className="text-xs font-serif italic text-wine">
          Composing editorial analysis for {activeDocument.name}...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-subtle-grid p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Editorial Report Masthead */}
        <div className="bg-paper rounded-3xl border border-cherry/20 p-6 sm:p-8 shadow-paper-lift flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle washi tape decorative strip */}
          <div className="absolute top-0 left-12 w-24 h-2 bg-blush/90 rounded-b" />

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blush-soft text-cherry flex items-center justify-center border border-cherry/20 shadow-2xs shrink-0">
              <FileText className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cherry font-bold">
                  Curated Analysis
                </span>
                <span className="text-wine-muted/40">•</span>
                <span className="text-xs text-wine-muted font-mono">
                  {activeDocument.version || 'Volume 1.0'}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wine tracking-tight">
                Inside this document
              </h1>
              <p className="text-xs font-serif italic text-wine-muted mt-1">
                {activeDocument.name}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center space-x-4 pt-3 md:pt-0 border-t md:border-t-0 border-cherry/10 text-xs text-wine font-mono">
            <div className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cherry" />
              <span>{activeDocument.pageCount} Pages</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-cherry" />
              <span>~{insights.metadata.readingTimeMinutes}m Read</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5 text-cherry" />
              <span>{insights.metadata.extractedKeywordsCount} Concepts</span>
            </div>
          </div>
        </div>

        {/* 1. SUMMARY (Styled like an editorial memo on textured cream paper) */}
        <div className="bg-paper rounded-3xl border border-cherry/20 p-6 sm:p-8 shadow-paper relative">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cherry/10">
            <div className="flex items-center space-x-2">
              <span className="text-cherry text-sm">✦</span>
              <h2 className="font-serif text-lg font-bold text-wine tracking-tight uppercase">
                SUMMARY
              </h2>
            </div>
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center space-x-1 text-xs font-medium text-wine-muted hover:text-cherry transition-colors cursor-pointer"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-700 font-serif">Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="font-serif">Copy summary</span>
                </>
              )}
            </button>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-cherry/30 py-1">
            <span className="absolute -top-3 left-0 font-serif text-4xl text-cherry/30 leading-none select-none">
              “
            </span>
            <p className="font-serif text-base sm:text-lg leading-relaxed text-wine italic">
              {insights.executiveSummary}
            </p>
          </div>
        </div>

        {/* Grid: KEY IDEAS & IMPORTANT CONCEPTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 2. KEY IDEAS (Pastel blush/lavender cards) */}
          <div className="bg-blush/30 rounded-3xl border border-blush-deep/60 p-6 sm:p-7 shadow-paper flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-5 pb-2 border-b border-cherry/10">
                <span className="text-cherry text-sm">✦</span>
                <h2 className="font-serif text-base font-bold text-wine tracking-tight uppercase">
                  KEY IDEAS
                </h2>
              </div>

              <div className="space-y-3">
                {insights.keyTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-3.5 bg-paper rounded-2xl border border-cherry/15 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="font-serif text-xs font-bold text-wine">{topic.name}</div>
                      <div className="text-[10px] text-wine-muted font-mono mt-0.5">
                        Occurs on pages: {topic.pageOccurrences.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-cream h-1.5 rounded-full overflow-hidden border border-cherry/15">
                        <div
                          className="bg-cherry h-full rounded-full"
                          style={{ width: `${topic.relevance}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-cherry">
                        {topic.relevance}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. IMPORTANT CONCEPTS (Glossary cards) */}
          <div className="bg-lavender/30 rounded-3xl border border-lavender-deep/60 p-6 sm:p-7 shadow-paper">
            <div className="flex items-center space-x-2 mb-5 pb-2 border-b border-cherry/10">
              <span className="text-cherry text-sm">✦</span>
              <h2 className="font-serif text-base font-bold text-wine tracking-tight uppercase">
                IMPORTANT CONCEPTS
              </h2>
            </div>

            <div className="space-y-3">
              {insights.importantConcepts.map((concept) => (
                <div
                  key={concept.id}
                  className="p-3.5 bg-paper rounded-2xl border border-cherry/15 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-xs font-bold text-cherry">{concept.term}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cream border border-cherry/15 text-wine-muted">
                      Page {concept.pageNumber}
                    </span>
                  </div>
                  <p className="text-xs text-wine-muted leading-relaxed font-sans">
                    {concept.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. DOCUMENT STRUCTURE (Book table of contents with dotted leader lines) */}
        <div className="bg-paper rounded-3xl border border-cherry/20 p-6 sm:p-8 shadow-paper">
          <div className="flex items-center space-x-2 mb-5 pb-2 border-b border-cherry/10">
            <span className="text-cherry text-sm">✦</span>
            <h2 className="font-serif text-base font-bold text-wine tracking-tight uppercase">
              DOCUMENT STRUCTURE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.documentStructure.map((sec) => (
              <div
                key={sec.id}
                className="p-4 bg-cream/50 rounded-2xl border border-cherry/15"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-xs font-bold text-wine line-clamp-1">
                    {sec.title}
                  </span>
                  <span className="text-[10px] font-mono text-cherry font-bold px-2 py-0.5 bg-paper rounded border border-cherry/20">
                    p. {sec.pageNumber}
                  </span>
                </div>

                {sec.subSections && (
                  <ul className="space-y-1.5 pl-2 border-l border-cherry/20 text-[11px] text-wine-muted">
                    {sec.subSections.map((sub, sIdx) => (
                      <li key={sIdx} className="flex items-center justify-between">
                        <span className="truncate pr-2 font-sans">{sub.title}</span>
                        <span className="font-mono text-cherry/70">p.{sub.pageNumber}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. QUESTIONS TO EXPLORE (Interactive prompt strips with arrows) */}
        <div className="bg-paper rounded-3xl border border-cherry/20 p-6 sm:p-8 shadow-paper">
          <div className="flex items-center justify-between mb-5 pb-2 border-b border-cherry/10">
            <div className="flex items-center space-x-2">
              <span className="text-cherry text-sm">✦</span>
              <h2 className="font-serif text-base font-bold text-wine tracking-tight uppercase">
                QUESTIONS TO EXPLORE
              </h2>
            </div>
            <span className="text-xs font-serif italic text-wine-muted">Click to query in reading notebook</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {insights.suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(question)}
                className="text-left p-4 rounded-2xl border border-cherry/20 hover:border-cherry hover:bg-blush-soft/60 transition-all group flex items-start justify-between shadow-2xs cursor-pointer bg-cream/40"
              >
                <span className="font-serif text-xs font-medium text-wine group-hover:text-cherry leading-snug">
                  {question}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-cherry group-hover:translate-x-1 transition-transform shrink-0 ml-2 mt-0.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
