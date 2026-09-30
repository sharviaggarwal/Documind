import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ProcessingSteps } from './ProcessingSteps';
import { useApp } from '../../context/AppContext';
import { UploadCloud, FileText, AlertCircle, ArrowRight, Sparkles, Paperclip } from 'lucide-react';

export const UploadModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    uploadProgress,
    handleFileUpload,
    resetUploadState,
    setActiveView,
    activeDocument,
  } = useApp();

  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isProcessing =
    uploadProgress.stage === 'uploading' ||
    uploadProgress.stage === 'extracting' ||
    uploadProgress.stage === 'indexing';

  const isReady = uploadProgress.stage === 'ready';

  const handleClose = () => {
    if (isProcessing) return;
    setIsUploadModalOpen(false);
    resetUploadState();
    setValidationError(null);
  };

  const processFile = async (file: File) => {
    setValidationError(null);

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setValidationError('Please upload a PDF document. Other formats are currently not supported.');
      return;
    }

    const MAX_SIZE_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setValidationError('File size exceeds the 50MB limit. Please upload a smaller PDF.');
      return;
    }

    await handleFileUpload(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing || isReady) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isProcessing && !isReady) {
      setIsDragOver(true);
    }
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const navigateToWorkspace = () => {
    handleClose();
    setActiveView('chat');
  };

  const navigateToInsights = () => {
    handleClose();
    setActiveView('insights');
  };

  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={handleClose}
      title={isReady ? 'Document Indexed' : isProcessing ? 'Reading Document' : 'Bring your document.'}
      description={
        isReady
          ? 'Your document is now cross-referenced and ready for interrogation.'
          : isProcessing
          ? 'Please hold while our ingestion engine reads and builds the citation graph.'
          : 'Drop a PDF here and let DocuMind do the reading.'
      }
      maxWidth="lg"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-800 animate-fade-in font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Upload / Processing Card */}
      {isProcessing || isReady ? (
        <div className="py-2">
          <ProcessingSteps
            currentStage={uploadProgress.stage}
            percentage={uploadProgress.percentage}
            statusMessage={uploadProgress.statusMessage}
            fileName={uploadProgress.fileName}
          />

          {isReady && (
            <div className="mt-6 pt-4 border-t border-cherry/10 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                className="flex-1"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={navigateToWorkspace}
              >
                Open in Reading Notebook
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                icon={<Sparkles className="w-4 h-4 text-cherry" />}
                onClick={navigateToInsights}
              >
                View Document Insights
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Paper Sheet Drop Area */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={handleBrowseClick}
            className={`cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden bg-cream/40 ${
              isDragOver
                ? 'border-cherry bg-blush-soft/60 scale-[1.01]'
                : 'border-cherry/30 hover:border-cherry/60 hover:bg-cream/70'
            }`}
          >
            {/* Paperclip top decoration */}
            <div className="absolute top-2 left-6 text-cherry/80 -rotate-12">
              <Paperclip className="w-6 h-6 stroke-[1.8]" />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blush text-cherry flex items-center justify-center mb-4 border border-cherry/20 shadow-paper">
              <UploadCloud className="w-7 h-7 stroke-[1.8]" />
            </div>

            <h4 className="font-serif text-xl font-bold text-wine mb-1 tracking-tight">
              Bring your document.
            </h4>
            <p className="text-xs text-wine-muted mb-5 font-sans">
              Drop a PDF here and let DocuMind do the reading. (PDF up to 50MB)
            </p>

            <Button
              variant="outline"
              size="sm"
              icon={<FileText className="w-3.5 h-3.5 text-cherry" />}
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseClick();
              }}
            >
              Choose a document
            </Button>
          </div>

          {/* Quick Sample File Trigger */}
          <div className="flex items-center justify-between p-3.5 bg-paper rounded-2xl border border-cherry/15 text-xs text-wine shadow-2xs">
            <span className="font-hand text-sm text-cherry font-semibold">
              ✦ Want to explore a pre-indexed sample volume?
            </span>
            <button
              type="button"
              className="font-semibold text-cherry hover:text-cherry-dark hover:underline cursor-pointer"
              onClick={() => {
                if (activeDocument) {
                  handleClose();
                  setActiveView('chat');
                }
              }}
            >
              Open Sample &rarr;
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
