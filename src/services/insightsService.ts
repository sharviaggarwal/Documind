import { Document, InsightData } from '../types';
import { MOCK_INSIGHTS } from '../data/mockData';
import { api } from './api';

class InsightsService {
  private insightsStore: Record<string, InsightData> = { ...MOCK_INSIGHTS };

  public async getInsights(document: Document): Promise<InsightData> {
    if (!api.getMockMode()) {
      return api.request<InsightData>(`/documents/${document.id}/insights`);
    }

    await api.simulateLatency(150, 350);

    if (this.insightsStore[document.id]) {
      return this.insightsStore[document.id];
    }

    // Synthesize structured insights for newly uploaded documents
    const docNameClean = document.name.replace(/\.[^/.]+$/, '');
    const generated: InsightData = {
      documentId: document.id,
      executiveSummary: `This document, entitled "${docNameClean}", was indexed across ${document.pageCount} pages. It contains critical operational clauses, strategic guidelines, and analytical findings that can be systematically interrogated via semantic search and cited context.`,
      metadata: {
        readingTimeMinutes: Math.max(4, Math.round(document.pageCount * 0.8)),
        extractedKeywordsCount: Math.round(document.pageCount * 3.5),
        totalParagraphs: document.pageCount * 6,
      },
      keyTopics: [
        {
          id: `kt-${Date.now()}-1`,
          name: `${docNameClean} Core Strategy`,
          relevance: 96,
          pageOccurrences: [1, 2, Math.min(document.pageCount, 4)],
          category: 'core'
        },
        {
          id: `kt-${Date.now()}-2`,
          name: 'Operational Guidelines & Implementation',
          relevance: 89,
          pageOccurrences: [2, 3],
          category: 'strategy'
        },
        {
          id: `kt-${Date.now()}-3`,
          name: 'Compliance & SLA Validation',
          relevance: 84,
          pageOccurrences: [Math.min(document.pageCount, 5)],
          category: 'technical'
        }
      ],
      importantConcepts: [
        {
          id: `ic-${Date.now()}-1`,
          term: 'Semantic Vector Representation',
          definition: `High-dimensional embeddings generated across all ${document.pageCount} pages of this file to enable cosine-similarity passage retrieval.`,
          pageNumber: 1
        },
        {
          id: `ic-${Date.now()}-2`,
          term: 'Auditability & Grounded Provenance',
          definition: 'Strict linkage between LLM synthesized answers and the underlying source text with page-level verification.',
          pageNumber: 2
        }
      ],
      documentStructure: document.pages.slice(0, 5).map((page) => ({
        id: `ds-${page.pageNumber}`,
        title: page.headings[0] || `Section ${page.pageNumber}.0`,
        pageNumber: page.pageNumber,
        subSections: [
          { title: page.headings[1] || `Detailed Analysis & Provisions`, pageNumber: page.pageNumber }
        ]
      })),
      suggestedQuestions: [
        `What are the core conclusions presented in ${docNameClean}?`,
        `What are the key technical or financial metrics outlined in this document?`,
        `Are there specific compliance, regulatory, or operational risks cited?`,
        `Summarize the key recommendations for organizational leadership.`
      ]
    };

    this.insightsStore[document.id] = generated;
    return generated;
  }
}

export const insightsService = new InsightsService();
