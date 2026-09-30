import { Document, UploadProgressState } from '../types';
import { INITIAL_DOCUMENTS } from '../data/mockData';
import { api } from './api';

class DocumentService {
  private localDocs: Document[] = [...INITIAL_DOCUMENTS];

  public async getDocuments(): Promise<Document[]> {
    if (api.getMockMode()) {
      await api.simulateLatency(150, 400);
      return [...this.localDocs];
    }
    return api.request<Document[]>('/documents');
  }

  public async getDocumentById(id: string): Promise<Document | null> {
    if (api.getMockMode()) {
      await api.simulateLatency(100, 250);
      const found = this.localDocs.find((doc) => doc.id === id);
      return found || null;
    }
    return api.request<Document>(`/documents/${id}`);
  }

  /**
   * Uploads a document with staged progress reporting:
   * Uploading -> Extracting -> Indexing -> Ready
   */
  public async uploadDocument(
    file: File,
    onProgress: (state: UploadProgressState) => void
  ): Promise<Document> {
    if (!api.getMockMode()) {
      const formData = new FormData();
      formData.append('file', file);
      return api.request<Document>('/documents/upload', {
        method: 'POST',
        body: formData,
      });
    }

    // Realistic multi-stage upload simulation
    // Stage 1: Uploading (0% -> 100%)
    onProgress({
      stage: 'uploading',
      percentage: 15,
      statusMessage: `Uploading ${file.name} to secure storage...`,
      fileName: file.name,
      fileSize: file.size,
    });
    await new Promise((r) => setTimeout(r, 600));

    onProgress({
      stage: 'uploading',
      percentage: 65,
      statusMessage: `Transferring bytes (${Math.round((file.size / 1024 / 1024) * 0.65 * 10) / 10} MB)...`,
      fileName: file.name,
      fileSize: file.size,
    });
    await new Promise((r) => setTimeout(r, 600));

    onProgress({
      stage: 'uploading',
      percentage: 100,
      statusMessage: 'Upload verified. Preparing parser...',
      fileName: file.name,
      fileSize: file.size,
    });
    await new Promise((r) => setTimeout(r, 400));

    // Stage 2: Extracting (OCR & text extraction)
    onProgress({
      stage: 'extracting',
      percentage: 40,
      statusMessage: 'Extracting text layout, tables, and document metadata...',
      fileName: file.name,
      fileSize: file.size,
    });
    await new Promise((r) => setTimeout(r, 900));

    onProgress({
      stage: 'extracting',
      percentage: 85,
      statusMessage: 'Normalizing typography and identifying chapter boundaries...',
      fileName: file.name,
      fileSize: file.size,
    });
    await new Promise((r) => setTimeout(r, 600));

    // Stage 3: Indexing (Chunking & vector embeddings)
    onProgress({
      stage: 'indexing',
      percentage: 30,
      statusMessage: 'Segmenting text into semantic chunks with overlapping windows...',
      fileName: file.name,
      fileSize: file.size,
    });
    await new Promise((r) => setTimeout(r, 800));

    onProgress({
      stage: 'indexing',
      percentage: 75,
      statusMessage: 'Generating dense vector embeddings and indexing into vector store...',
      fileName: file.name,
      fileSize: file.size,
    });
    await new Promise((r) => setTimeout(r, 700));

    onProgress({
      stage: 'indexing',
      percentage: 95,
      statusMessage: 'Building citation graph and inverse index...',
      fileName: file.name,
      fileSize: file.size,
    });
    await new Promise((r) => setTimeout(r, 500));

    // Stage 4: Ready
    const formatSize = (bytes: number) => {
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Synthesize realistic document structure from the uploaded file
    const docId = `doc-${Date.now()}`;
    const estimatedPages = Math.max(3, Math.min(48, Math.round(file.size / (150 * 1024))));

    const newDoc: Document = {
      id: docId,
      name: file.name,
      fileType: 'PDF',
      fileSizeBytes: file.size,
      fileSizeFormatted: formatSize(file.size),
      pageCount: estimatedPages,
      uploadedAt: 'Just now',
      lastOpened: 'Just now',
      status: 'ready',
      category: 'Uploaded Document',
      version: 'v1.0 Indexed',
      summary: `Automated semantic index generated for ${file.name}. Fully searchable via semantic retrieval, grounded synthesis, and cited passage verification.`,
      pages: Array.from({ length: Math.min(estimatedPages, 8) }).map((_, i) => ({
        pageNumber: i + 1,
        snippet: `Section ${i + 1}: Overview of key provisions, analytical data, and contextual notes for ${file.name.replace(/\.[^/.]+$/, '')}.`,
        preview: `Document analysis and indexed segment for Page ${i + 1}.`,
        headings: [`Section ${i + 1}.0 Main Findings`, `Analysis ${i + 1}.1`]
      }))
    };

    this.localDocs = [newDoc, ...this.localDocs];

    onProgress({
      stage: 'ready',
      percentage: 100,
      statusMessage: 'Document successfully indexed and ready for AI interrogation!',
      fileName: file.name,
      fileSize: file.size,
    });

    return newDoc;
  }

  public async deleteDocument(id: string): Promise<boolean> {
    if (api.getMockMode()) {
      await api.simulateLatency(200, 400);
      this.localDocs = this.localDocs.filter((d) => d.id !== id);
      return true;
    }
    await api.request(`/documents/${id}`, { method: 'DELETE' });
    return true;
  }
}

export const documentService = new DocumentService();
