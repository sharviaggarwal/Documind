import { Message } from '../types';

export interface ChatSession {
  id: string;
  title: string;
  documentId: string;
  documentName: string;
  updatedAt: string;
  messages: Message[];
}

const getStorageKey = (userId?: string) => {
  return `documind_sessions_${userId || 'guest'}`;
};

class HistoryService {
  public getSessions(userId?: string): ChatSession[] {
    try {
      const data = localStorage.getItem(getStorageKey(userId));
      if (!data) return [];
      return JSON.parse(data) as ChatSession[];
    } catch (e) {
      console.error('Error reading chat sessions:', e);
      return [];
    }
  }

  public getSessionById(id: string, userId?: string): ChatSession | null {
    const sessions = this.getSessions(userId);
    return sessions.find((s) => s.id === id) || null;
  }

  public saveSession(session: ChatSession, userId?: string): void {
    try {
      const sessions = this.getSessions(userId);
      const existingIdx = sessions.findIndex((s) => s.id === session.id);

      if (existingIdx >= 0) {
        sessions[existingIdx] = {
          ...session,
          updatedAt: new Date().toISOString(),
        };
      } else {
        sessions.unshift({
          ...session,
          updatedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem(getStorageKey(userId), JSON.stringify(sessions));
    } catch (e) {
      console.error('Error saving chat session:', e);
    }
  }

  public deleteSession(id: string, userId?: string): void {
    try {
      const sessions = this.getSessions(userId).filter((s) => s.id !== id);
      localStorage.setItem(getStorageKey(userId), JSON.stringify(sessions));
    } catch (e) {
      console.error('Error deleting chat session:', e);
    }
  }

  public createSession(
    firstQuestion: string,
    documentId: string,
    documentName: string,
    messages: Message[],
    userId?: string
  ): ChatSession {
    const title =
      firstQuestion.length > 40
        ? `${firstQuestion.slice(0, 40)}...`
        : firstQuestion || 'Conversation';

    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title,
      documentId,
      documentName,
      updatedAt: new Date().toISOString(),
      messages,
    };

    this.saveSession(newSession, userId);
    return newSession;
  }
}

export const historyService = new HistoryService();
