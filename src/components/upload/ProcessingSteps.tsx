import React from 'react';
import { UploadStage } from '../../types';
import { Check, Loader2, Upload, FileText, Database, Sparkles } from 'lucide-react';

interface ProcessingStepsProps {
  currentStage: UploadStage;
  percentage: number;
  statusMessage: string;
  fileName?: string;
}

const STEPS: { stage: UploadStage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { stage: 'uploading', label: 'Uploading', icon: Upload },
  { stage: 'extracting', label: 'Reading', icon: FileText },
  { stage: 'indexing', label: 'Indexing', icon: Database },
  { stage: 'ready', label: 'Ready to explore', icon: Sparkles },
];

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({
  currentStage,
  percentage,
  statusMessage,
  fileName,
}) => {
  const getStepStatus = (stepStage: UploadStage) => {
    const stageOrder: UploadStage[] = ['uploading', 'extracting', 'indexing', 'ready'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stepIndex = stageOrder.indexOf(stepStage);

    if (currentStage === 'ready') return 'completed';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="py-2 space-y-6">
      {/* File badge on cream card */}
      {fileName && (
        <div className="flex items-center justify-between p-3.5 bg-cream/70 rounded-2xl border border-cherry/15 shadow-2xs">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blush text-cherry flex items-center justify-center shrink-0 border border-cherry/20 shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-serif font-bold text-sm text-wine truncate">{fileName}</div>
              <div className="text-[11px] font-mono text-wine-muted">Processing reading docket</div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blush-soft text-cherry border border-cherry/20">
            {percentage}%
          </span>
        </div>
      )}

      {/* Stepper with stationery badges */}
      <div className="relative">
        <div className="flex items-center justify-between relative z-10">
          {STEPS.map((step) => {
            const status = getStepStatus(step.stage);
            const Icon = step.icon;

            return (
              <div key={step.stage} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-cherry text-white shadow-paper'
                      : status === 'active'
                      ? 'bg-blush text-cherry ring-4 ring-blush-soft shadow-paper animate-pulse border border-cherry/30'
                      : 'bg-paper text-wine-muted/50 border border-cherry/15'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : status === 'active' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-serif transition-colors text-center ${
                    status === 'active'
                      ? 'text-cherry font-bold'
                      : status === 'completed'
                      ? 'text-wine font-semibold'
                      : 'text-wine-muted/50'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Horizontal Connector Line */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-cherry/10 -z-0">
          <div
            className="h-full bg-gradient-to-r from-blush via-lavender to-cherry transition-all duration-500 rounded-full"
            style={{
              width:
                currentStage === 'uploading'
                  ? '25%'
                  : currentStage === 'extracting'
                  ? '55%'
                  : currentStage === 'indexing'
                  ? '85%'
                  : currentStage === 'ready'
                  ? '100%'
                  : '0%',
            }}
          />
        </div>
      </div>

      {/* Progress Bar & Status Text */}
      <div className="space-y-2 pt-2">
        <div className="w-full bg-cream h-2 rounded-full overflow-hidden border border-cherry/15">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              currentStage === 'ready'
                ? 'bg-cherry'
                : 'bg-gradient-to-r from-blush to-cherry'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-center text-wine-muted font-hand text-sm font-semibold tracking-wide">
          {statusMessage || 'Preparing reading index...'}
        </p>
      </div>
    </div>
  );
};
