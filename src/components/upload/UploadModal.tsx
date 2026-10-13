import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ProcessingSteps, FileProgressDetail } from './ProcessingSteps';
import { useApp } from '../../context/AppContext';
import { documentService, UploadJobStatus } from '../../services/documentService';
import { UploadStage } from '../../types';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Paperclip,
  RotateCcw,
} from 'lucide-react';

export const UploadModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    setActiveView,
    activeDocument,
    setActiveDocument,
    refreshDocuments,
  } = useApp();

  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [stage, setStage] = useState<UploadStage>('idle');
  const [globalPercent, setGlobalPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [filesProgress, setFilesProgress] = useState<Record<string, FileProgressDetail>>({});
  const [primaryFileName, setPrimaryFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isProcessing = stage === 'uploading' || stage === 'extracting' || stage === 'indexing';
  const isReady = stage === 'ready';
  const isError = stage === 'error';

  const resetLocalState = () => {
    setStage('idle');
    setGlobalPercent(0);
    setStatusMessage('');
    setFilesProgress({});
    setValidationError(null);
    setPrimaryFileName('');
  };

  const handleClose = () => {
    if (isProcessing) return;
    setIsUploadModalOpen(false);
    resetLocalState();
  };

  const processFiles = async (fileList: FileList | File[]) => {
    setValidationError(null);
    const filesArray = Array.from(fileList);

    if (filesArray.length === 0) return;

    // Validate PDF types
    const invalidFiles = filesArray.filter(
      (f) => !f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf'
    );
    if (invalidFiles.length > 0) {
      setValidationError(
        `Only PDF files are supported. Invalid file: ${invalidFiles.map((f) => f.name).join(', ')}`
      );
      return;
    }

    // Validate size limit (50MB per file)
    const MAX_SIZE = 50 * 1024 * 1024;
    const oversizedFiles = filesArray.filter((f) => f.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      setValidationError(
        `File exceeds 50MB limit: ${oversizedFiles.map((f) => f.name).join(', ')}`
      );
      return;
    }

    setPrimaryFileName(
      filesArray.length === 1 ? filesArray[0].name : `${filesArray.length} PDF Documents`
    );
    setStage('uploading');
    setGlobalPercent(15);
    setStatusMessage(`Uploading ${filesArray.length} document(s) to server...`);

    const initialProgress: Record<string, FileProgressDetail> = {};
    filesArray.forEach((f) => {
      initialProgress[f.name] = {
        status: 'pending',
        pages_done: 0,
        total_pages: 0,
        message: 'Uploading to server...',
      };
    });
    setFilesProgress(initialProgress);

    try {
      const updatedDocs = await documentService.uploadDocuments(
        filesArray,
        (job: UploadJobStatus) => {
          setFilesProgress(job.files || {});

          const filesEntries = Object.values(job.files || {});
          if (filesEntries.length > 0) {
            let totalPages = 0;
            let pagesDone = 0;
            let anyExtracting = false;
            let anyIndexing = false;

            filesEntries.forEach((info) => {
              totalPages += info.total_pages || 1;
              pagesDone += info.pages_done || 0;
              if (info.status === 'processing') {
                if (info.message?.toLowerCase().includes('embedding')) {
                  anyIndexing = true;
                } else {
                  anyExtracting = true;
                }
              }
            });

            if (anyIndexing) {
              setStage('indexing');
              setStatusMessage('Generating dense vector embeddings and indexing into FAISS...');
            } else if (anyExtracting) {
              setStage('extracting');
              setStatusMessage(
                totalPages > 0
                  ? `Reading and running EasyOCR (${pagesDone} of ${totalPages} pages complete)...`
                  : 'Extracting document layout and text...'
              );
            }

            const calcPct =
              totalPages > 0 ? Math.min(95, Math.round((pagesDone / totalPages) * 100)) : 35;
            setGlobalPercent(Math.max(25, calcPct));
          }
        }
      );

      // Successfully processed
      setStage('ready');
      setGlobalPercent(100);
      setStatusMessage('All documents indexed and ready for AI interrogation!');

      await refreshDocuments();

      // Set active document to the newly uploaded document
      if (updatedDocs.length > 0) {
        const matchingDoc = updatedDocs.find((d) => d.name === filesArray[0].name);
        setActiveDocument(matchingDoc || updatedDocs[0]);
      }

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // canvas blocked or unsupported
      }
    } catch (err: unknown) {
      console.error('Upload processing failed:', err);
      setStage('error');
      setGlobalPercent(0);
      const errMsg = (err as { message?: string })?.message || String(err);
      setStatusMessage(`Processing failed: ${errMsg}`);
      setValidationError(`Error during processing: ${errMsg}`);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing || isReady) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
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
      processFiles(e.target.files);
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
      title={
        isReady
          ? 'Documents Indexed'
          : isProcessing
          ? 'Ingesting & Indexing'
          : isError
          ? 'Ingestion Issue'
          : 'Bring your documents.'
      }
      description={
        isReady
          ? 'Your documents are cross-referenced in FAISS and BM25 and ready for interrogation.'
          : isProcessing
          ? 'Extracting text with PyMuPDF, EasyOCR fallback, and neural embedding generation.'
          : isError
          ? 'An error occurred during extraction or embedding. Please review the details below.'
          : 'Drop one or more PDFs here and let DocuMind build the neural citation graph.'
      }
      maxWidth="lg"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Validation or Processing Error Banner */}
      {validationError && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-800 animate-fade-in font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="flex-1">{validationError}</span>
          {isError && (
            <button
              onClick={resetLocalState}
              className="text-red-700 underline font-semibold hover:text-red-900 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* Main Upload / Processing Card */}
      {isProcessing || isReady ? (
        <div className="py-2">
          <ProcessingSteps
            currentStage={stage}
            percentage={globalPercent}
            statusMessage={statusMessage}
            fileName={primaryFileName}
            filesProgress={filesProgress}
          />

          {isReady && (
            <div className="mt-6 pt-4 border-t border-cherry/10">
              <Button
                variant="primary"
                className="w-full justify-center"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={navigateToWorkspace}
              >
                Start Asking Questions
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Paper Sheet Multi-Drop Area */}
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
              Bring your documents.
            </h4>
            <p className="text-xs text-wine-muted mb-5 font-sans">
              Drag & drop one or multiple PDFs here (up to 50MB each).
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
              Choose PDF files
            </Button>
          </div>

          {/* Quick Active Volume Indicator */}
          {activeDocument && (
            <div className="flex items-center justify-between p-3.5 bg-paper rounded-2xl border border-cherry/15 text-xs text-wine shadow-2xs">
              <span className="font-hand text-sm text-cherry font-semibold">
                ✦ Currently exploring: {activeDocument.name}
              </span>
              <button
                type="button"
                className="font-semibold text-cherry hover:text-cherry-dark hover:underline cursor-pointer"
                onClick={() => {
                  handleClose();
                  setActiveView('chat');
                }}
              >
                Go to Notebook &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
