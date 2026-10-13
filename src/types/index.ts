export interface DocumentPage {
  pageNumber: number;
  preview: string;
  headings: string[];
  snippet: string;
}

export interface Document {
  id: string;
  name: string;
  fileType: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  pageCount: number;
  uploadedAt: string;
  lastOpened: string;
  status: 'uploading' | 'extracting' | 'indexing' | 'ready' | 'error';
  summary: string;
  pages: DocumentPage[];
  category?: string;
  version?: string;
}

export interface Citation {
  id: string;
  sourceNumber: number;
  pageNumber: number;
  sectionHeading: string;
  snippet: string;
  fullPassage: string;
  similarityScore: number; // e.g. 0.94
}

export interface Message {
  id: string;
  documentId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  isLoading?: boolean;
}

export interface KeyTopic {
  id: string;
  name: string;
  relevance: number; // 0 - 100
  pageOccurrences: number[];
  category: 'core' | 'strategy' | 'technical' | 'financial';
}

export interface ImportantConcept {
  id: string;
  term: string;
  definition: string;
  pageNumber: number;
}

export interface SectionNode {
  id: string;
  title: string;
  pageNumber: number;
  subSections?: { title: string; pageNumber: number }[];
}

export interface InsightData {
  documentId: string;
  executiveSummary: string;
  keyTopics: KeyTopic[];
  importantConcepts: ImportantConcept[];
  documentStructure: SectionNode[];
  suggestedQuestions: string[];
  metadata: {
    readingTimeMinutes: number;
    extractedKeywordsCount: number;
    totalParagraphs: number;
  };
}

export interface SavedItem {
  id: string;
  documentId: string;
  documentName: string;
  title: string;
  snippet: string;
  pageNumber: number;
  savedAt: string;
  type: 'citation' | 'insight' | 'note';
  tags?: string[];
}

export type LLMModel = 'claude-3-5-sonnet' | 'gpt-4o' | 'gemini-1-5-pro' | 'llama-3-70b';

export interface RAGSettings {
  model: LLMModel;
  temperature: number;
  retrievalTopK: number;
  chunkSize: number;
  similarityThreshold: number;
  systemPrompt: string;
  streamSpeed: 'fast' | 'normal' | 'instant';
  useMockBackend: boolean;
}

export type UploadStage = 'idle' | 'uploading' | 'extracting' | 'indexing' | 'ready' | 'error';

export interface UploadProgressState {
  stage: UploadStage;
  percentage: number;
  statusMessage: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export type ActiveView = 'home' | 'documents' | 'chat' | 'insights' | 'saved' | 'settings';
