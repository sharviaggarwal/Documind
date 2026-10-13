import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { LLMModel } from '../../types';
import {
  Cpu,
  Database,
  Terminal,
  Check,
  Server,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formState, setFormState] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const MODELS: { id: LLMModel; name: string; provider: string; desc: string }[] = [
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      desc: 'Exceptional nuanced reasoning, citation precision, and literary cadence.',
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      desc: 'High speed and comprehensive domain understanding across dense corporate dockets.',
    },
    {
      id: 'gemini-1-5-pro',
      name: 'Gemini 1.5 Pro',
      provider: 'Google DeepMind',
      desc: 'Massive context window with robust cross-volume synthesis.',
    },
    {
      id: 'llama-3-70b',
      name: 'Llama 3 70B Instruct',
      provider: 'Meta (Air-Gapped)',
      desc: 'Open-weights architecture ideal for strict privacy compliance.',
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="h-full overflow-y-auto bg-subtle-grid p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="pb-2 border-b border-cherry/12">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cherry font-bold">
              Configuration
            </span>
            <span className="text-cherry text-xs">✦</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine tracking-tight mt-0.5">
            Notebook & Model Settings
          </h2>
          <p className="text-xs text-wine-muted italic mt-0.5">
            Fine-tune vector retrieval thresholds, generation parameters, and backend connectivity
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Model Selection */}
          <div className="bg-paper rounded-3xl border border-cherry/20 p-6 sm:p-7 shadow-paper space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blush-soft text-cherry flex items-center justify-center border border-cherry/20">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-wine">Inference Engine</h3>
                <p className="text-xs text-wine-muted">
                  Select the foundation LLM orchestrating document question-answering
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {MODELS.map((model) => {
                const isSelected = formState.model === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setFormState({ ...formState, model: model.id })}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-cherry bg-blush-soft/80 ring-2 ring-cherry/20 shadow-2xs'
                        : 'border-cherry/15 hover:border-cherry/35 bg-cream/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif text-xs font-bold text-wine">{model.name}</span>
                      <Badge variant="neutral" size="sm">
                        {model.provider}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-wine-muted leading-relaxed font-sans">{model.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Retrieval & Vector Parameters */}
          <div className="bg-paper rounded-3xl border border-cherry/20 p-6 sm:p-7 shadow-paper space-y-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blush-soft text-cherry flex items-center justify-center border border-cherry/20">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-wine">Retrieval & Vector Search</h3>
                <p className="text-xs text-wine-muted">
                  Control how passages are extracted and filtered from the vector database
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Top-K Chunks */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-serif font-bold text-wine">Retrieval Top-K Chunks</label>
                  <span className="font-mono text-cherry font-bold">{formState.retrievalTopK}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={formState.retrievalTopK}
                  onChange={(e) =>
                    setFormState({ ...formState, retrievalTopK: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-cherry"
                />
                <p className="text-[11px] text-wine-muted font-sans">
                  Number of highest-scoring passages provided as grounded context to the model.
                </p>
              </div>

              {/* Similarity Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-serif font-bold text-wine">Similarity Threshold</label>
                  <span className="font-mono text-cherry font-bold">
                    {Math.round(formState.similarityThreshold * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={0.95}
                  step={0.01}
                  value={formState.similarityThreshold}
                  onChange={(e) =>
                    setFormState({ ...formState, similarityThreshold: parseFloat(e.target.value) })
                  }
                  className="w-full accent-cherry"
                />
                <p className="text-[11px] text-wine-muted font-sans">
                  Minimum cosine similarity score required for a document passage to be cited.
                </p>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-serif font-bold text-wine">Temperature (Strictness)</label>
                  <span className="font-mono text-cherry font-bold">{formState.temperature}</span>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  value={formState.temperature}
                  onChange={(e) =>
                    setFormState({ ...formState, temperature: parseFloat(e.target.value) })
                  }
                  className="w-full accent-cherry"
                />
                <p className="text-[11px] text-wine-muted font-sans">
                  Lower values (0.1–0.3) maximize factual strictness and source citation adherence.
                </p>
              </div>

              {/* Chunk Size */}
              <div className="space-y-2">
                <label className="block text-xs font-serif font-bold text-wine">
                  Chunk Token Window
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[256, 512, 1024].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormState({ ...formState, chunkSize: size })}
                      className={`py-1.5 px-3 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                        formState.chunkSize === size
                          ? 'border-cherry bg-blush text-wine font-bold'
                          : 'border-cherry/15 text-wine-muted hover:bg-cream'
                      }`}
                    >
                      {size} tokens
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-wine-muted font-sans">
                  Segment size when chunking input PDFs into the vector database.
                </p>
              </div>
            </div>
          </div>

          {/* 3. System Instruction Prompt */}
          <div className="bg-paper rounded-3xl border border-cherry/20 p-6 sm:p-7 shadow-paper space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blush-soft text-cherry flex items-center justify-center border border-cherry/20">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-wine">System Instruction Prompt</h3>
                <p className="text-xs text-wine-muted">
                  Guiding instruction passed with every RAG prompt assembly
                </p>
              </div>
            </div>

            <textarea
              rows={3}
              value={formState.systemPrompt}
              onChange={(e) => setFormState({ ...formState, systemPrompt: e.target.value })}
              className="w-full bg-cream/70 border border-cherry/20 rounded-2xl p-3.5 text-xs text-wine font-mono focus:outline-none focus:border-cherry leading-relaxed"
            />
          </div>

          {/* 4. Backend Service Abstraction Status */}
          <div className="bg-paper rounded-3xl border border-cherry/20 p-6 sm:p-7 shadow-paper space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blush-soft text-cherry flex items-center justify-center border border-cherry/20">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-wine">Backend API Adapter</h3>
                  <p className="text-xs text-wine-muted">
                    Service abstraction layer ready for FastAPI / Express / LangChain
                  </p>
                </div>
              </div>

              <Badge variant="cherry" size="sm" className="font-mono text-[9px] uppercase">
                Active Adapter
              </Badge>
            </div>

            <div className="p-3.5 bg-cream/70 rounded-2xl border border-cherry/15 flex items-center justify-between">
              <div>
                <div className="font-serif text-xs font-bold text-wine">
                  Simulated Mock Service
                </div>
                <div className="text-[11px] text-wine-muted font-sans">
                  Configured in <code className="text-cherry font-mono">src/services/api.ts</code>.
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-800 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Operational</span>
              </span>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            {savedSuccess && (
              <span className="text-xs font-serif text-emerald-800 font-semibold flex items-center space-x-1 animate-fade-in">
                <Check className="w-4 h-4" />
                <span>Preferences saved to notebook!</span>
              </span>
            )}

            <Button variant="primary" type="submit">
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
