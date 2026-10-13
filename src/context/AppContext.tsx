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
import { historyService, ChatSession } from '../services/historyService';
import { AuthUser, getCurrentUser, getSupabase } from '../lib/supabase';
import { INITIAL_SAVED_ITEMS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  isAuthChecking: boolean;
  logout: () => Promise<void>;
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
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  startNewChat: () => void;
  loadChatSession: (sessionId: string) => void;
  deleteChatSession: (sessionId: string) => void;
}

const DEFAULT_SETTINGS: RAGSettings = {
  model: 'llama-3-70b',
  temperature: 0.2,
  retrievalTopK: 3,
  chunkSize: 2000,
  similarityThreshold: 0.78,
  systemPrompt: 'You are DocuMind, an AI document intelligence assistant. Answer questions strictly grounded in the uploaded document. Use [doc | Page n] citations.',
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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<ActiveView>('chat');
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

  // History state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Check auth session
  useEffect(() => {
    getCurrentUser().then((user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });

    const client = getSupabase();
    if (client) {
      const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user && session.user.email) {
          setCurrentUser({ id: session.user.id, email: session.user.email });
        } else if (!localStorage.getItem('documind_guest_user')) {
          setCurrentUser(null);
        }
      });
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, []);

  const refreshSessions = useCallback(() => {
    const list = historyService.getSessions(currentUser?.id);
    setChatSessions(list);
  }, [currentUser?.id]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const logout = useCallback(async () => {
    localStorage.removeItem('documind_guest_user');
    const client = getSupabase();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.error('Sign out error:', e);
      }
    }
    setCurrentUser(null);
    setChatMessages([]);
    setCurrentSessionId(null);
  }, []);

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

  const selectDocumentAndOpen = useCallback((doc: Document, view: ActiveView = 'chat') => {
    setActiveDocument(doc);
    setActiveView(view);
  }, []);

  const startNewChat = useCallback(() => {
    setCurrentSessionId(null);
    setChatMessages([]);
    setSelectedSource(null);
    setActiveCitationId(null);
  }, []);

  const loadChatSession = useCallback(
    (sessionId: string) => {
      const session = historyService.getSessionById(sessionId, currentUser?.id);
      if (session) {
        setCurrentSessionId(session.id);
        setChatMessages(session.messages || []);

        const doc = documents.find(
          (d) => d.id === session.documentId || d.name === session.documentName
        );
        if (doc) {
          setActiveDocument(doc);
        }

        const lastWithCit = [...(session.messages || [])]
          .reverse()
          .find((m) => m.citations && m.citations.length > 0);
        if (lastWithCit?.citations && lastWithCit.citations.length > 0) {
          setSelectedSource(lastWithCit.citations[0]);
        } else {
          setSelectedSource(null);
        }
      }
    },
    [currentUser?.id, documents]
  );

  const deleteChatSession = useCallback(
    (sessionId: string) => {
      historyService.deleteSession(sessionId, currentUser?.id);
      refreshSessions();
      if (currentSessionId === sessionId) {
        startNewChat();
      }
    },
    [currentUser?.id, currentSessionId, refreshSessions, startNewChat]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const docId = activeDocument ? activeDocument.id : 'all';
      const docName = activeDocument ? activeDocument.name : 'General Document';

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        documentId: docId,
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

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

      const newMessagesList = [...chatMessages, userMsg, placeholderAssistantMsg];
      setChatMessages(newMessagesList);
      setIsStreaming(true);

      // Determine or create session ID
      let sessId = currentSessionId;
      let sessionTitle = content.trim().slice(0, 40);

      if (!sessId) {
        const created = historyService.createSession(
          content.trim(),
          docId,
          docName,
          [userMsg, placeholderAssistantMsg],
          currentUser?.id
        );
        sessId = created.id;
        sessionTitle = created.title;
        setCurrentSessionId(sessId);
      }

      try {
        const responseMsg = await ragService.query(
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

        // Update full message in state
        const updatedList = [
          ...chatMessages,
          userMsg,
          {
            ...responseMsg,
            id: assistantMsgId,
            isLoading: false,
          },
        ];
        setChatMessages(updatedList);

        // Persist to session history
        historyService.saveSession(
          {
            id: sessId,
            title: sessionTitle,
            documentId: docId,
            documentName: docName,
            updatedAt: new Date().toISOString(),
            messages: updatedList,
          },
          currentUser?.id
        );
        refreshSessions();
      } catch (err: unknown) {
        console.error('Error generating AI response:', err);
        const errMsg = (err as { message?: string })?.message || String(err);
        const errorAssistantMsg: Message = {
          id: assistantMsgId,
          documentId: docId,
          role: 'assistant',
          content: `⚠️ Failed to generate answer: ${errMsg}. Please verify the DocuMind backend (port 8000) and Ollama are running.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLoading: false,
        };

        const updatedList = [...chatMessages, userMsg, errorAssistantMsg];
        setChatMessages(updatedList);

        historyService.saveSession(
          {
            id: sessId,
            title: sessionTitle,
            documentId: docId,
            documentName: docName,
            updatedAt: new Date().toISOString(),
            messages: updatedList,
          },
          currentUser?.id
        );
        refreshSessions();
      } finally {
        setIsStreaming(false);
      }
    },
    [activeDocument, chatMessages, currentSessionId, currentUser?.id, isStreaming, refreshSessions, settings]
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
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
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
        currentUser,
        setCurrentUser,
        isAuthChecking,
        logout,
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
        chatSessions,
        currentSessionId,
        startNewChat,
        loadChatSession,
        deleteChatSession,
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
