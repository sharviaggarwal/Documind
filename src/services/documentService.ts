import { Document, UploadProgressState } from '../types';
import { api } from './api';

export interface BackendDoc {
  doc_id: string;
  name: string;
  page_count: number;
  chunk_count: number;
  file_size_bytes: number;
}

export interface FileProgress {
  status: 'pending' | 'processing' | 'ready' | 'error';
  pages_done: number;
  total_pages: number;
  message: string;
}

export interface UploadJobStatus {
  job_id: string;
  status: 'processing' | 'completed' | 'failed';
  files: Record<string, FileProgress>;
  error?: string | null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

class DocumentService {
  public async getDocuments(): Promise<Document[]> {
    try {
      const rawDocs = await api.request<BackendDoc[]>('/documents');
      return rawDocs.map((d) => ({
        id: d.doc_id,
        name: d.name,
        fileType: 'PDF',
        fileSizeBytes: d.file_size_bytes || 0,
        fileSizeFormatted: formatBytes(d.file_size_bytes || 0),
        pageCount: Math.max(1, d.page_count),
        uploadedAt: 'Active Index',
        lastOpened: 'Recently',
        status: 'ready',
        category: 'Indexed Volume',
        version: `${d.chunk_count} Chunks`,
        summary: `Document indexed with ${d.chunk_count} semantic chunks and vector embeddings across ${d.page_count} pages.`,
        pages: Array.from({ length: Math.min(Math.max(1, d.page_count), 12) }).map((_, i) => ({
          pageNumber: i + 1,
          snippet: `Page ${i + 1} content excerpt from ${d.name}.`,
          preview: `Indexed segment for page ${i + 1}.`,
          headings: [`Section ${i + 1}`],
        })),
      }));
    } catch (err) {
      console.error('Failed to fetch documents from backend:', err);
      return [];
    }
  }

  public async getDocumentById(id: string): Promise<Document | null> {
    const all = await this.getDocuments();
    return all.find((d) => d.id === id || d.name === id) || null;
  }

  /**
   * Multi-file upload with background job polling and real-time per-file progress tracking.
   */
  public async uploadDocuments(
    files: File[],
    onJobProgress: (job: UploadJobStatus) => void
  ): Promise<Document[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    // 1. Submit files to backend
    const uploadRes = await api.request<{ job_id: string; files: string[] }>('/upload', {
      method: 'POST',
      body: formData,
    });

    const jobId = uploadRes.job_id;

    // 2. Poll job status until completed or failed
    let isFinished = false;
    let finalJob: UploadJobStatus | null = null;

    while (!isFinished) {
      await new Promise((r) => setTimeout(r, 600));
      try {
        const job = await api.request<UploadJobStatus>(`/upload/${jobId}`);
        finalJob = job;
        onJobProgress(job);

        if (job.status === 'completed') {
          isFinished = true;
        } else if (job.status === 'failed') {
          throw new Error(job.error || 'Document processing failed in backend.');
        }
      } catch (err) {
        if (finalJob?.status === 'failed') throw err;
        console.warn('Status poll retry:', err);
      }
    }

    // 3. Fetch latest indexed documents
    return await this.getDocuments();
  }

  /**
   * Single-file upload wrapper for backwards compatibility
   */
  public async uploadDocument(
    file: File,
    onProgress: (state: UploadProgressState) => void
  ): Promise<Document> {
    onProgress({
      stage: 'uploading',
      percentage: 20,
      statusMessage: `Uploading ${file.name}...`,
      fileName: file.name,
      fileSize: file.size,
    });

    const docs = await this.uploadDocuments([file], (job) => {
      const fileStatus = job.files[file.name];
      if (fileStatus) {
        const total = fileStatus.total_pages || 1;
        const done = fileStatus.pages_done || 0;
        const pct = Math.min(95, Math.round((done / total) * 100));

        onProgress({
          stage: fileStatus.status === 'ready' ? 'ready' : done > 0 ? 'indexing' : 'extracting',
          percentage: fileStatus.status === 'ready' ? 100 : Math.max(25, pct),
          statusMessage: fileStatus.message || `Processing page ${done} of ${total}...`,
          fileName: file.name,
          fileSize: file.size,
        });
      }
    });

    const found = docs.find((d) => d.name === file.name);
    if (!found) {
      throw new Error(`Uploaded file ${file.name} was not found in document list.`);
    }

    onProgress({
      stage: 'ready',
      percentage: 100,
      statusMessage: `${file.name} indexed and ready!`,
      fileName: file.name,
      fileSize: file.size,
    });

    return found;
  }

  public async deleteDocument(id: string): Promise<boolean> {
    await api.request(`/documents/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return true;
  }
}

export const documentService = new DocumentService();
