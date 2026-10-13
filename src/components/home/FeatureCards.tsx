import React from 'react';
import { MessageSquare, Search, BookmarkCheck } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const FEATURES = [
    {
      number: '01',
      tag: 'ASK',
      title: 'Ask your document anything.',
      description: 'Complex financial tables, dense statutory regulations, or buried operational clauses. Ask natural questions as if reading alongside a brilliant researcher.',
      bg: 'bg-paper',
      border: 'border-cherry/20',
      icon: MessageSquare,
      tagBg: 'bg-blush-soft text-cherry border-cherry/20',
      note: 'Conversational context retention ✦',
    },
    {
      number: '02',
      tag: 'FIND',
      title: 'Surface the information that matters.',
      description: 'Zero hallucinations. Semantic vector chunking extracts only verifiable evidence, filtering out noise and summarizing intricate points with surgical precision.',
      bg: 'bg-blush/40',
      border: 'border-blush-deep/50',
      icon: Search,
      tagBg: 'bg-paper text-wine border-cherry/20',
      note: 'Dense vector embeddings ✦',
    },
    {
      number: '03',
      tag: 'CITE',
      title: 'Know exactly where the answer came from.',
      description: 'Every statement is cross-referenced with exact page numbers and verbatim excerpts. Click any citation to inspect the source material directly.',
      bg: 'bg-lavender/40',
      border: 'border-lavender-deep/50',
      icon: BookmarkCheck,
      tagBg: 'bg-paper text-wine border-cherry/20',
      note: 'Auditable source provenance ✦',
    },
  ];

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-cherry/12">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cherry font-bold">
            How DocuMind Reads
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine mt-1">
            An editorial approach to document intelligence
          </h2>
        </div>
        <span className="text-cherry text-sm hidden sm:inline">✦ ✦ ✦</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.number}
              className={`${feature.bg} rounded-3xl border ${feature.border} p-7 shadow-paper hover:shadow-paper-lift transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
            >
              {/* Subtle stationery corner fold detail */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-cream/60 border-b border-l border-cherry/10 rounded-bl-xl pointer-events-none" />

              <div>
                {/* Header: Oversized Serif Number + Tag */}
                <div className="flex items-baseline justify-between mb-6">
                  <span className="font-serif text-4xl sm:text-5xl font-black text-cherry/40 group-hover:text-cherry transition-colors duration-200">
                    {feature.number}
                  </span>

                  <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${feature.tagBg}`}>
                    {feature.tag}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-paper/80 flex items-center justify-center mb-4 border border-cherry/15 text-cherry shadow-2xs group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-wine mb-2.5 leading-snug">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-wine-muted leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>

              {/* Hand-written style marginal note at bottom */}
              <div className="mt-6 pt-4 border-t border-cherry/10 flex items-center justify-between">
                <span className="font-hand text-sm text-cherry font-medium">
                  {feature.note}
                </span>
                <span className="text-[10px] font-mono text-wine-muted/60">
                  Step {idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
