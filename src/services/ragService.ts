import { Citation, Document, Message, RAGSettings } from '../types';
import { MOCK_CHAT_HISTORY } from '../data/mockData';
import { api } from './api';

class RAGService {
  private chatSessions: Record<string, Message[]> = { ...MOCK_CHAT_HISTORY };

  public async getMessages(documentId: string): Promise<Message[]> {
    if (api.getMockMode()) {
      await api.simulateLatency(100, 200);
      return this.chatSessions[documentId] ? [...this.chatSessions[documentId]] : [];
    }
    return api.request<Message[]>(`/documents/${documentId}/messages`);
  }

  /**
   * Executes a RAG query against the document.
   * Can stream incremental text chunks via `onChunk(partialText, citations)`.
   */
  public async query(
    document: Document,
    question: string,
    settings: RAGSettings,
    onChunk?: (streamedContent: string, citations: Citation[]) => void
  ): Promise<Message> {
    if (!api.getMockMode()) {
      return api.request<Message>(`/documents/${document.id}/query`, {
        method: 'POST',
        body: JSON.stringify({ question, settings }),
      });
    }

    // Generate grounded answer & citations based on document content & question
    const { responseText, citations } = this.synthesizeAnswer(document, question, settings);

    const messageId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (settings.streamSpeed === 'instant') {
      const finalMsg: Message = {
        id: messageId,
        documentId: document.id,
        role: 'assistant',
        content: responseText,
        timestamp,
        citations,
      };
      this.saveMessage(document.id, finalMsg);
      return finalMsg;
    }

    // Stream chunks smoothly
    const words = responseText.split(' ');
    let currentText = '';
    const delayPerToken = settings.streamSpeed === 'fast' ? 18 : 36;

    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      if (onChunk) {
        onChunk(currentText, citations);
      }
      await new Promise((r) => setTimeout(r, delayPerToken));
    }

    const finalMessage: Message = {
      id: messageId,
      documentId: document.id,
      role: 'assistant',
      content: responseText,
      timestamp,
      citations,
    };

    this.saveMessage(document.id, finalMessage);
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

  /**
   * Intelligently synthesizes response and citation passages
   */
  private synthesizeAnswer(
    document: Document,
    question: string,
    _settings: RAGSettings
  ): { responseText: string; citations: Citation[] } {
    const qLower = question.toLowerCase();

    // Check if we have pre-matched responses for standard mock docs
    if (document.id === 'doc-1') {
      if (qLower.includes('margin') || qLower.includes('operating') || qLower.includes('r&d') || qLower.includes('efficiency')) {
        return {
          responseText: `Based on **${document.name}**, here is the breakdown of operating margin and operational efficiency:

### Operating Performance Highlights
* **Non-GAAP Operating Margin**: Reached **22.1%**, expanding **320 basis points** year-over-year [1].
* **Efficiency Catalysts**: Operating leverage was driven by accelerated automation across customer onboarding and automated invoice processing [1].
* **R&D Capital Investment**: Totaled **$28.4M**, with focused engineering allocation directed toward agentic AI document pipelines and low-latency infrastructure [2].

> The operating leverage achieved allows the business to reinvest aggressively in generative product lines without compromising margin targets [1].`,
          citations: [
            {
              id: `cit-${Date.now()}-1`,
              sourceNumber: 1,
              pageNumber: 12,
              sectionHeading: '4.2 Operating Expenses Breakdown',
              snippet: 'Non-GAAP operating margin expanded 320 bps to 22.1%. R&D investments totaled $28.4M focused on agentic AI pipelines.',
              fullPassage: 'Operating Expenses & Efficiency Analysis: Non-GAAP operating margin expanded 320 bps to 22.1%. Automation tooling and infrastructure consolidation drove 180 bps of the margin improvement.',
              similarityScore: 0.94
            },
            {
              id: `cit-${Date.now()}-2`,
              sourceNumber: 2,
              pageNumber: 14,
              sectionHeading: '4.4 Engineering & R&D Priorities',
              snippet: 'Strategic R&D investment directed toward autonomous workflow engines and proprietary document indexing.',
              fullPassage: 'Research & Development Strategy: Capital deployed into agentic tooling increased by 42% YoY, establishing competitive moats in proprietary retrieval speed and contextual synthesis.',
              similarityScore: 0.89
            }
          ]
        };
      } else if (qLower.includes('guidance') || qLower.includes('outlook') || qLower.includes('q4') || qLower.includes('future')) {
        return {
          responseText: `According to **${document.name}** (Section 6.0), the company provided the following fiscal guidance and outlook:

* **Q4 Net Revenue Target**: Projected in the range of **$151.0M to $154.5M**, representing continued YoY expansion of **26%–29%** [1].
* **Full-Year ARR Milestone**: Anticipated to surpass **$450M in Annual Recurring Revenue** by fiscal year-end [1].
* **Non-GAAP Operating Margin Floor**: Expected to maintain a minimum of **21.5%** despite seasonal marketing investments [2].

\`\`\`json
{
  "q4_projected_revenue_min": "$151.0M",
  "q4_projected_revenue_max": "$154.5M",
  "fy_arr_milestone": ">$450.0M",
  "projected_operating_margin": "21.5% - 22.5%"
}
\`\`\``,
          citations: [
            {
              id: `cit-${Date.now()}-1`,
              sourceNumber: 1,
              pageNumber: 24,
              sectionHeading: '6.0 FY Guidance & Risk Disclosures',
              snippet: 'Q4 projected revenue between $151.0M and $154.5M, projecting full-year ARR above $450M.',
              fullPassage: 'Fiscal Guidance: Fourth-quarter net revenue is expected to be in the range of $151.0 million to $154.5 million. The company expects to end the full fiscal year with Annual Recurring Revenue (ARR) exceeding $450 million.',
              similarityScore: 0.97
            },
            {
              id: `cit-${Date.now()}-2`,
              sourceNumber: 2,
              pageNumber: 24,
              sectionHeading: '6.2 Operating Margin Expectations',
              snippet: 'Non-GAAP operating margins expected to stabilize between 21.5% and 22.5% for the closing quarter.',
              fullPassage: 'Operating Outlook: Operating margins are projected to stabilize within the 21.5% to 22.5% corridor as platform scale offsets holiday seasonality.',
              similarityScore: 0.91
            }
          ]
        };
      }
    }

    // Dynamic grounded answer generation for any document
    const primaryPage = document.pages[0] || { pageNumber: 1, headings: ['Overview'], snippet: document.summary };
    const secondaryPage = document.pages[1] || primaryPage;

    const citation1: Citation = {
      id: `cit-${Date.now()}-1`,
      sourceNumber: 1,
      pageNumber: primaryPage.pageNumber,
      sectionHeading: primaryPage.headings[0] || '1.0 Core Provisions',
      snippet: primaryPage.snippet || document.summary.slice(0, 140),
      fullPassage: `${primaryPage.preview || primaryPage.snippet} Grounded context extracted from ${document.name} regarding "${question}".`,
      similarityScore: 0.93
    };

    const citation2: Citation = {
      id: `cit-${Date.now()}-2`,
      sourceNumber: 2,
      pageNumber: secondaryPage.pageNumber,
      sectionHeading: secondaryPage.headings[0] || '2.0 Analytical Evaluation',
      snippet: secondaryPage.snippet || `Detailed procedural context and metrics extracted from page ${secondaryPage.pageNumber}.`,
      fullPassage: `Cross-referenced segment: ${secondaryPage.preview || secondaryPage.snippet} This corroborates the primary findings outlined in section ${secondaryPage.headings[0] || 'Key Provisions'}.`,
      similarityScore: 0.88
    };

    const answer = `Based on an analysis of **${document.name}**, here are the findings regarding **"${question}"**:

### Key Grounded Takeaways
* **Primary Finding**: ${citation1.snippet} [1].
* **Contextual Analysis**: Corroborating evidence on page ${citation2.pageNumber} details how this directly aligns with the operational scope outlined in **${citation2.sectionHeading}** [2].
* **Synthesis & Summary**: The documentation provides explicit validation that all relevant conditions and metrics fulfill standard regulatory and organizational parameters.

> Verified across **${document.pageCount} indexed pages** using semantic chunking and dense vector retrieval [1][2].`;

    return {
      responseText: answer,
      citations: [citation1, citation2]
    };
  }
}

export const ragService = new RAGService();
