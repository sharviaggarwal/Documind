import React from 'react';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Paperclip, Sparkles, Bookmark, ArrowUpRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setIsUploadModalOpen, setActiveView, documents, setActiveDocument } = useApp();

  const handleExploreDemo = () => {
    if (documents.length > 0) {
      setActiveDocument(documents[0]);
    }
    setActiveView('chat');
  };

  return (
    <section className="relative pt-6 pb-12 sm:pb-16 text-center max-w-4xl mx-auto">
      {/* Decorative top stamp badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blush-soft border border-cherry/20 mb-6 shadow-2xs">
        <span className="text-cherry text-xs">✦</span>
        <span className="text-xs font-serif font-bold text-wine tracking-wide uppercase">
          The Intelligent Reading Notebook
        </span>
        <span className="text-cherry text-xs">✦</span>
      </div>

      {/* Editorial Headline */}
      <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-wine tracking-tight leading-[1.08] mb-6">
        Your documents.<br />
        <span className="italic font-normal text-cherry">Now they make sense.</span>
      </h1>

      {/* Supporting Text */}
      <p className="text-base sm:text-lg text-wine-muted font-sans font-normal leading-relaxed mb-9 max-w-2xl mx-auto">
        Upload, ask, explore and understand your documents with AI-powered answers grounded in your sources.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full sm:w-auto px-7 py-3 text-base shadow-paper-lift"
        >
          Start Reading →
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleExploreDemo}
          className="w-full sm:w-auto px-7 py-3 text-base"
        >
          Explore Demo
        </Button>
      </div>

      {/* Hero Visual: The Intelligent Digital Notebook */}
      <div className="relative mx-auto max-w-3xl mt-2 px-4 sm:px-8">
        {/* Background decorative stacked sheets */}
        <div className="absolute inset-x-10 -bottom-3 h-40 bg-blush/30 rounded-3xl -rotate-2 border border-cherry/10 -z-20" />
        <div className="absolute inset-x-6 -bottom-1.5 h-44 bg-lavender/30 rounded-3xl rotate-1 border border-cherry/10 -z-10" />

        {/* Main Stacked Paper Workspace */}
        <div className="relative bg-paper rounded-3xl border border-cherry/20 shadow-paper-lift p-6 sm:p-8 text-left bg-subtle-grid overflow-hidden">
          {/* Paperclip in top corner */}
          <div className="absolute -top-3.5 left-10 text-cherry drop-shadow-sm flex items-center space-x-1">
            <Paperclip className="w-8 h-8 rotate-45 stroke-[1.8]" />
            <span className="text-[10px] font-hand font-bold text-cherry bg-blush-soft px-2 py-0.5 rounded border border-cherry/20 rotate-2">
              docket #402
            </span>
          </div>

          {/* Top bookmark ribbon / tab */}
          <div className="flex items-center justify-between border-b border-cherry/10 pb-4 mb-5 pt-2">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-sm text-wine tracking-tight">
                Q3 Financial & Operational Report
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cream border border-cherry/15 text-wine-muted">
                Page 12 of 24
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-hand text-wine-muted hidden sm:inline">
                * grounded in 4 citations ✦
              </span>
              <Bookmark className="w-4 h-4 text-cherry fill-cherry" />
            </div>
          </div>

          {/* Simulated Document Excerpt with Highlights */}
          <div className="space-y-4 font-serif text-sm leading-relaxed text-wine">
            <p>
              "During the third fiscal quarter, consolidated net revenue expanded to <span className="highlight-blush font-semibold font-sans">\$142.8M (+28% YoY)</span>, outperforming quarterly expectations across tiered enterprise accounts."
            </p>

            {/* Simulated AI Grounded Response Bubble inside the notebook */}
            <div className="my-3 p-4 bg-cream/90 rounded-2xl border border-cherry/15 shadow-2xs font-sans text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cherry" />
                  <span className="font-serif font-bold text-wine text-xs">DocuMind Query</span>
                </div>
                <span className="font-mono text-[10px] text-cherry bg-blush-soft px-1.5 py-0.5 rounded border border-cherry/20">
                  96% Match
                </span>
              </div>

              <p className="text-wine text-xs leading-relaxed">
                Operating efficiency was heavily catalyzed by automated document intake workflows, producing <span className="highlight-yellow font-semibold">320 bps of operating margin expansion</span>.
              </p>

              {/* Source tags */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-paper text-cherry border border-cherry/20 text-[10px] font-mono font-bold shadow-2xs">
                  <span>SOURCE 01</span>
                  <span>•</span>
                  <span>PAGE 12</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-paper text-wine-muted border border-cherry/15 text-[10px] font-mono shadow-2xs">
                  <span>SOURCE 02</span>
                  <span>•</span>
                  <span>PAGE 18</span>
                </span>
              </div>
            </div>

            {/* Handwritten marginalia notes */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-1 gap-2 text-wine">
              <div className="font-hand text-base text-cherry font-semibold flex items-center space-x-1.5">
                <span>↳</span>
                <span>Verified: No debt obligations maturing prior to 2029 ✦</span>
              </div>
              <div className="text-[11px] font-sans text-wine-muted flex items-center space-x-1">
                <span>Confidence score: 0.96</span>
                <ArrowUpRight className="w-3 h-3 text-cherry" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
