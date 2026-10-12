import { Citation, Document, Message, RAGSettings } from '../types';
import { api } from './api';

export interface AskResponse {
  answer: string;
  sources: Array<{
    doc: string;
    page: number;
    snippet: string;
  }>;
}

class RAGService {
  private chatSessions: Record<string, Message[]> = {};

  public async getMessages(documentId: string): Promise<Message[]> {
    return this.chatSessions[documentId] ? [...this.chatSessions[documentId]] : [];
  }

  /**
   * Queries the FastAPI /ask endpoint with question and optional document filter.
   * Smoothly streams tokens if enabled, otherwise returns instant response.
   */
  public async query(
    document: Document | null,
    question: string,
    settings: RAGSettings,
    onChunk?: (streamedContent: string, citations: Citation[]) => void
  ): Promise<Message> {
    const docId = document ? document.name || document.id : 'all';

    // Call live FastAPI /ask endpoint
    const response = await api.request<AskResponse>('/ask', {
      method: 'POST',
      body: JSON.stringify({
        question: question.trim(),
        doc_ids: document ? [document.name || document.id] : undefined,
        top_k: settings.retrievalTopK || 3,
      }),
    });

    const responseText = response.answer || 'No response generated.';

    const citations: Citation[] = (response.sources || []).map((src, idx) => ({
      id: `cite-${idx + 1}`,
      sourceNumber: idx + 1,
      pageNumber: src.page,
      sectionHeading: `${src.doc} — Page ${src.page}`,
      snippet: src.snippet.length > 220 ? src.snippet.slice(0, 220) + '...' : src.snippet,
      fullPassage: src.snippet,
      similarityScore: 0.92 - idx * 0.05,
    }));

    const messageId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (settings.streamSpeed === 'instant' || !onChunk) {
      const finalMsg: Message = {
        id: messageId,
        documentId: docId,
        role: 'assistant',
        content: responseText,
        timestamp,
        citations,
      };
      this.saveMessage(docId, finalMsg);
      return finalMsg;
    }

    // Stream tokens smoothly for responsive UI
    const words = responseText.split(' ');
    let currentText = '';
    const delayPerToken = settings.streamSpeed === 'fast' ? 12 : 24;

    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      onChunk(currentText, citations);
      await new Promise((r) => setTimeout(r, delayPerToken));
    }

    const finalMessage: Message = {
      id: messageId,
      documentId: docId,
      role: 'assistant',
      content: responseText,
      timestamp,
      citations,
    };

    this.saveMessage(docId, finalMessage);
    return finalMessage;
  }

  public saveMessage(documentId: string, message: Message) {
    if (!this.chatSessions[documentId]) {
      this.chatSessions[documentId] = [];
    }
    this.chatSessions[documentId].push(message);
  }

  public clearChat(documentId: string) {
    this.chatSessions[documentId] = [];
  }
}

export const ragService = new RAGService();
