import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  ActiveView,
  Citation,
  Document,
  Message,
  RAGSettings,
  SavedItem,
  UploadProgressState
} from '../types';
import { documentService } from '../services/documentService';
import { ragService } from '../services/ragService';
import { INITIAL_SAVED_ITEMS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  documents: Document[];
  activeDocument: Document | null;
  setActiveDocument: (doc: Document | null) => void;
  chatMessages: Message[];
  isStreaming: boolean;
  activeCitationId: string | null;
  setActiveCitationId: (id: string | null) => void;
  selectedSource: Citation | null;
  setSelectedSource: (citation: Citation | null) => void;
  activePageNumber: number;
  setActivePageNumber: (page: number) => void;
  savedItems: SavedItem[];
  saveItem: (item: Omit<SavedItem, 'id' | 'savedAt'>) => void;
  removeSavedItem: (id: string) => void;
  settings: RAGSettings;
  updateSettings: (newSettings: Partial<RAGSettings>) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  uploadProgress: UploadProgressState;
  handleFileUpload: (file: File) => Promise<Document | null>;
  sendMessage: (content: string) => Promise<void>;
  deleteDoc: (id: string) => Promise<void>;
  selectDocumentAndOpen: (doc: Document, view?: ActiveView) => void;
  resetUploadState: () => void;
  refreshDocuments: () => Promise<Document[]>;
}

const DEFAULT_SETTINGS: RAGSettings = {
  model: 'llama-3-70b',
  temperature: 0.2,
  retrievalTopK: 3,
  chunkSize: 2000,
  similarityThreshold: 0.78,
  systemPrompt: 'You are DocuMind, an AI document intelligence assistant. Answer the user\'s question using ONLY the information provided in the context. Ground claims strictly in cited [doc | Page n] sources.',
  streamSpeed: 'fast',
  useMockBackend: false,
};

const INITIAL_UPLOAD_PROGRESS: UploadProgressState = {
  stage: 'idle',
  percentage: 0,
  statusMessage: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [activeCitationId, setActiveCitationId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<Citation | null>(null);
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [savedItems, setSavedItems] = useState<SavedItem[]>(INITIAL_SAVED_ITEMS);
  const [settings, setSettings] = useState<RAGSettings>(DEFAULT_SETTINGS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>(INITIAL_UPLOAD_PROGRESS);

  const refreshDocuments = useCallback(async (): Promise<Document[]> => {
    try {
      const docs = await documentService.getDocuments();
      setDocuments(docs);
      if (docs.length > 0 && !activeDocument) {
        setActiveDocument(docs[0]);
      }
      return docs;
    } catch (err) {
      console.error('Error refreshing documents:', err);
      return [];
    }
  }, [activeDocument]);

  // Load initial documents
  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  // Sync chat messages when active document changes
  useEffect(() => {
    if (activeDocument) {
      ragService.getMessages(activeDocument.id).then((msgs) => {
        setChatMessages(msgs);
        const lastMsgWithCitations = [...msgs].reverse().find((m) => m.citations && m.citations.length > 0);
        if (lastMsgWithCitations && lastMsgWithCitations.citations && lastMsgWithCitations.citations.length > 0) {
          setSelectedSource(lastMsgWithCitations.citations[0]);
        } else {
          setSelectedSource(null);
        }
      });
      setActivePageNumber(1);
    }
  }, [activeDocument]);

  const selectDocumentAndOpen = useCallback((doc: Document, view: ActiveView = 'chat') => {
    setActiveDocument(doc);
    setActiveView(view);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const docId = activeDocument ? activeDocument.id : 'all';

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        documentId: docId,
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Append user message immediately
      setChatMessages((prev) => [...prev, userMsg]);
      ragService.saveMessage(docId, userMsg);

      // Create placeholder assistant message
      const assistantMsgId = `asst-${Date.now()}`;
      const placeholderAssistantMsg: Message = {
        id: assistantMsgId,
        documentId: docId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLoading: true,
        citations: [],
      };

      setChatMessages((prev) => [...prev, placeholderAssistantMsg]);
      setIsStreaming(true);

      try {
        await ragService.query(
          activeDocument,
          content,
          settings,
          (streamedContent, citations) => {
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: streamedContent,
                      citations,
                      isLoading: false,
                    }
                  : m
              )
            );
            if (citations && citations.length > 0) {
              setSelectedSource(citations[0]);
            }
          }
        );
      } catch (err: unknown) {
        console.error('Error generating AI response:', err);
        const errMsg = (err as { message?: string })?.message || String(err);
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: `⚠️ Failed to generate answer: ${errMsg}. Please check if the DocuMind backend (port 8000) and Ollama ('llama3.1:8b') are active.`,
                  isLoading: false,
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [activeDocument, isStreaming, settings]
  );

  const handleFileUpload = useCallback(
    async (file: File): Promise<Document | null> => {
      try {
        const newDoc = await documentService.uploadDocument(file, (state) => {
          setUploadProgress(state);
        });

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore in non-browser or if canvas blocked
        }

        await refreshDocuments();
        setActiveDocument(newDoc);
        return newDoc;
      } catch (err: unknown) {
        console.error('Upload failed:', err);
        const errMsg = (err as { message?: string })?.message || String(err);
        setUploadProgress({
          stage: 'error',
          percentage: 0,
          statusMessage: 'Failed to process document. Please try again.',
          error: errMsg,
        });
        return null;
      }
    },
    [refreshDocuments]
  );

  const resetUploadState = useCallback(() => {
    setUploadProgress(INITIAL_UPLOAD_PROGRESS);
  }, []);

  const deleteDoc = useCallback(
    async (id: string) => {
      try {
        await documentService.deleteDocument(id);
        const updated = await refreshDocuments();
        if (activeDocument?.id === id || activeDocument?.name === id) {
          setActiveDocument(updated[0] || null);
        }
      } catch (err) {
        console.error('Error deleting document:', err);
      }
    },
    [activeDocument, refreshDocuments]
  );

  const saveItem = useCallback((item: Omit<SavedItem, 'id' | 'savedAt'>) => {
    const newItem: SavedItem = {
      ...item,
      id: `save-${Date.now()}`,
      savedAt: 'Just now',
    };
    setSavedItems((prev) => [newItem, ...prev]);
  }, []);

  const removeSavedItem = useCallback((id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<RAGSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        documents,
        activeDocument,
        setActiveDocument,
        chatMessages,
        isStreaming,
        activeCitationId,
        setActiveCitationId,
        selectedSource,
        setSelectedSource,
        activePageNumber,
        setActivePageNumber,
        savedItems,
        saveItem,
        removeSavedItem,
        settings,
        updateSettings,
        isUploadModalOpen,
        setIsUploadModalOpen,
        uploadProgress,
        handleFileUpload,
        sendMessage,
        deleteDoc,
        selectDocumentAndOpen,
        resetUploadState,
        refreshDocuments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
