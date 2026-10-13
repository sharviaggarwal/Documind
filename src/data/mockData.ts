import { Document, InsightData, Message, SavedItem } from '../types';

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Q3 Financial & Operational Report.pdf',
    fileType: 'PDF',
    fileSizeBytes: 4200000,
    fileSizeFormatted: '4.2 MB',
    pageCount: 24,
    uploadedAt: '2 hours ago',
    lastOpened: '10 minutes ago',
    status: 'ready',
    category: 'Finance',
    version: 'v3.1 Final',
    summary: 'Comprehensive quarterly financial disclosures highlighting 28% YoY revenue expansion, gross margins of 68.4%, and scaled enterprise recurring revenue.',
    pages: [
      {
        pageNumber: 1,
        snippet: 'Executive Summary & Letter to Shareholders: Overview of Q3 achievements and macroeconomic positioning.',
        preview: 'Executive Summary & Financial Highlights for the Third Quarter',
        headings: ['1.0 Executive Summary', 'Key Metrics Overview']
      },
      {
        pageNumber: 4,
        snippet: 'Consolidated Statements of Operations: Net revenue reached $142.8M, representing a 28% increase from $111.5M in Q3 prior year.',
        preview: 'Net Revenue: $142.8M (+28% YoY). Gross Profit: $97.7M (68.4% margin).',
        headings: ['2.1 Consolidated Statements', 'Revenue by Geography']
      },
      {
        pageNumber: 8,
        snippet: 'Segmental Performance: Enterprise SaaS ARR grew 34% to $108.2M, driven by 124% net revenue retention among Fortune 500 cohorts.',
        preview: 'Enterprise ARR: $108.2M (+34% YoY). NRR: 124% across tiered accounts.',
        headings: ['3.0 Business Segment Analysis', 'Enterprise SaaS Growth']
      },
      {
        pageNumber: 12,
        snippet: 'Operating Expenses & Efficiency: Non-GAAP operating margin expanded 320 bps to 22.1%. R&D investments totaled $28.4M focused on agentic AI pipelines.',
        preview: 'Operating Margin: 22.1% (+320 bps). R&D Expenditure: $28.4M.',
        headings: ['4.2 Operating Expenses Breakdown', 'R&D Allocation & Automation']
      },
      {
        pageNumber: 18,
        snippet: 'Liquidity, Balance Sheet & CapEx: Cash and short-term equivalents stood at $310.5M with zero outstanding debt maturity before 2029.',
        preview: 'Cash & Short-Term Investments: $310.5M. Free Cash Flow: $34.2M.',
        headings: ['5.1 Capital Allocation Strategy', 'Liquidity & Cash Flow']
      },
      {
        pageNumber: 24,
        snippet: 'Fiscal Guidance & Forward-Looking Outlook: Q4 projected revenue between $151.0M and $154.5M, projecting full-year ARR above $450M.',
        preview: 'Q4 Guidance: $151M - $154.5M. Full Year 2026 Target: $450M ARR.',
        headings: ['6.0 FY Guidance & Risk Disclosures', 'Conclusion']
      }
    ]
  },
  {
    id: 'doc-2',
    name: 'Enterprise AI Safety & Governance Blueprint.pdf',
    fileType: 'PDF',
    fileSizeBytes: 6800000,
    fileSizeFormatted: '6.8 MB',
    pageCount: 36,
    uploadedAt: 'Yesterday',
    lastOpened: '2 hours ago',
    status: 'ready',
    category: 'Governance & AI',
    version: 'v2.4',
    summary: 'Standardized operational frameworks for enterprise foundation model deployment, red-teaming procedures, risk taxonomy, and EU AI Act alignment.',
    pages: [
      {
        pageNumber: 1,
        snippet: 'Introduction to Enterprise Trust & Safety: Defining acceptable risk thresholds for generative AI deployments.',
        preview: 'Foundational Principles of AI Assurance and Risk Mitigation in Regulated Industries',
        headings: ['1.0 Scope & Objectives', 'Organizational Governance']
      },
      {
        pageNumber: 7,
        snippet: 'Automated Red-Teaming Protocol: Multi-agent red teaming suites designed to simulate prompt injections, jailbreaks, and indirect data poisoning.',
        preview: 'Dynamic Threat Modeling: Adversarial testing methodologies and vector space isolation.',
        headings: ['2.3 Adversarial Red-Teaming', 'Threat Surface Matrix']
      },
      {
        pageNumber: 15,
        snippet: 'Human-in-the-Loop (HITL) Thresholds: Mandatory human intervention workflows when model confidence scores fall below 0.88 or cite low-trust sources.',
        preview: 'HITL Escalation Matrix: Trigger criteria, audit trails, and reviewer latency bounds.',
        headings: ['3.1 Operational Controls', 'Escalation Thresholds']
      },
      {
        pageNumber: 22,
        snippet: 'Regulatory Compliance & EU AI Act Crosswalk: Mapping high-risk system obligations to Article 9 risk management systems and Article 13 transparency directives.',
        preview: 'Compliance Crosswalk: ISO 42001, NIST AI RMF, and European Union AI Act requirements.',
        headings: ['4.0 Statutory Alignment', 'EU AI Act Article 9 & 13']
      },
      {
        pageNumber: 31,
        snippet: 'Audit Trails & Cryptographic Watermarking: Immutably hashing system prompt revisions, retrieval snapshots, and inference logs for 7-year retention.',
        preview: 'Verifiable Provenance: Cryptographic audit logs and vector store snapshot hashes.',
        headings: ['5.2 Auditability & Provenance', 'Forensic Logging Standards']
      },
      {
        pageNumber: 36,
        snippet: 'Executive Summary Checklist & Sign-Off Matrix: Chief AI Officer, General Counsel, and CISO joint approval requirements prior to production release.',
        preview: 'Production Readiness Sign-Off Gate & Continuous Monitoring Schedule.',
        headings: ['6.0 Production Gate Matrix', 'Sign-Off Signatures']
      }
    ]
  },
  {
    id: 'doc-3',
    name: 'Cloud Infrastructure Migration Strategy.pdf',
    fileType: 'PDF',
    fileSizeBytes: 3100000,
    fileSizeFormatted: '3.1 MB',
    pageCount: 18,
    uploadedAt: '3 days ago',
    lastOpened: 'Yesterday',
    status: 'ready',
    category: 'Engineering',
    version: 'v1.0',
    summary: 'Technical roadmap for zero-downtime database replication, multi-region Kubernetes clusters, and Istio service mesh micro-segmentation.',
    pages: [
      {
        pageNumber: 1,
        snippet: 'Executive Architectural Vision: Transitioning legacy monolithic workloads to declarative multi-cloud Kubernetes clusters.',
        preview: 'Modernizing Infrastructure: Target Architecture Overview & Business Continuity SLAs',
        headings: ['1.0 Executive Overview', 'Target State Architecture']
      },
      {
        pageNumber: 6,
        snippet: 'Database Replication Strategy: Active-passive PostgreSQL replication with sub-second lag and automated failover via Patroni and Raft consensus.',
        preview: 'Zero-Downtime Data Migration: Dual-write patterns and streaming CDC replication.',
        headings: ['2.2 Storage & Persistence', 'PostgreSQL Patroni Cluster']
      },
      {
        pageNumber: 11,
        snippet: 'Zero-Trust Security Mesh: Enforcing mTLS 1.3 across all pod-to-pod communications using SPIFFE/SPIRE identity attestation and Cilium eBPF policies.',
        preview: 'Identity-Driven Security: Micro-segmentation with Cilium eBPF and Istio Mesh.',
        headings: ['3.4 Network Isolation', 'mTLS & Cryptographic Identity']
      },
      {
        pageNumber: 18,
        snippet: 'Disaster Recovery & Chaos Testing: Verified RPO under 15 seconds and RTO under 90 seconds under simulated regional backbone severance.',
        preview: 'Resilience Verification: Chaos Engineering scenarios and Disaster Recovery SLAs.',
        headings: ['4.5 SLA Validation', 'Post-Mortem Runbooks']
      }
    ]
  }
];

export const MOCK_CHAT_HISTORY: Record<string, Message[]> = {
  'doc-1': [
    {
      id: 'msg-1',
      documentId: 'doc-1',
      role: 'user',
      content: 'What were the main financial drivers for Q3, and what are our current liquidity reserves?',
      timestamp: '10:14 AM'
    },
    {
      id: 'msg-2',
      documentId: 'doc-1',
      role: 'assistant',
      content: `Based on the **Q3 Financial & Operational Report**, here are the primary drivers and current liquidity status:

### 1. Revenue & Operating Performance
* **Net Revenue**: Totaled **$142.8M**, reflecting a **28% year-over-year increase** from $111.5M in Q3 of the prior fiscal year [1].
* **Enterprise ARR Momentum**: Enterprise SaaS recurring revenue surged **34% YoY to $108.2M**, heavily bolstered by a **124% net revenue retention (NRR)** rate among Fortune 500 enterprises [2].
* **Operating Margin Expansion**: Non-GAAP operating margin expanded by **320 basis points to 22.1%**, while the organization directed **$28.4M toward R&D** focused on automated AI pipelines [3].

### 2. Liquidity & Capital Position
* **Cash Reserves**: Total cash, cash equivalents, and short-term liquid investments reached **$310.5M** with no debt obligations maturing prior to 2029 [4].
* **Free Cash Flow**: Generated **$34.2M** in positive free cash flow for the quarter, demonstrating sustainable self-funded growth [4].

> The company remains positioned with ample capital to finance organic product expansion while maintaining healthy operational buffers.`,
      timestamp: '10:15 AM',
      citations: [
        {
          id: 'cit-1',
          sourceNumber: 1,
          pageNumber: 4,
          sectionHeading: '2.1 Consolidated Statements',
          snippet: 'Net revenue reached $142.8M, representing a 28% increase from $111.5M in Q3 prior year. Gross margin expanded to 68.4%.',
          fullPassage: 'Consolidated Statements of Operations: Net revenue reached $142.8M, representing a 28% increase from $111.5M in Q3 prior year. Gross profit stood at $97.7M, representing a 68.4% gross margin compared to 66.1% in the prior year period.',
          similarityScore: 0.96
        },
        {
          id: 'cit-2',
          sourceNumber: 2,
          pageNumber: 8,
          sectionHeading: '3.0 Business Segment Analysis',
          snippet: 'Enterprise SaaS ARR grew 34% to $108.2M, driven by 124% net revenue retention among Fortune 500 cohorts.',
          fullPassage: 'Segmental Performance Breakdown: Enterprise SaaS ARR grew 34% YoY to $108.2M, propelled by 124% net revenue retention across high-tier enterprise contracts and expanded multi-seat licensing.',
          similarityScore: 0.94
        },
        {
          id: 'cit-3',
          sourceNumber: 3,
          pageNumber: 12,
          sectionHeading: '4.2 Operating Expenses Breakdown',
          snippet: 'Non-GAAP operating margin expanded 320 bps to 22.1%. R&D investments totaled $28.4M focused on agentic AI pipelines.',
          fullPassage: 'Operating Expenses & Efficiency Analysis: Non-GAAP operating margin expanded 320 bps to 22.1%. R&D investments totaled $28.4M focused on agentic AI pipelines and developer tooling modernization.',
          similarityScore: 0.92
        },
        {
          id: 'cit-4',
          sourceNumber: 4,
          pageNumber: 18,
          sectionHeading: '5.1 Capital Allocation Strategy',
          snippet: 'Cash and short-term equivalents stood at $310.5M with zero outstanding debt maturity before 2029. Free Cash Flow was $34.2M.',
          fullPassage: 'Liquidity, Balance Sheet & CapEx: Cash and short-term equivalents stood at $310.5M with zero outstanding debt maturity before 2029. Free Cash Flow generated in Q3 totaled $34.2M, demonstrating continued balance sheet durability.',
          similarityScore: 0.95
        }
      ]
    }
  ],
  'doc-2': [
    {
      id: 'msg-201',
      documentId: 'doc-2',
      role: 'user',
      content: 'What are the required Human-in-the-Loop escalation criteria under this governance blueprint?',
      timestamp: 'Yesterday'
    },
    {
      id: 'msg-202',
      documentId: 'doc-2',
      role: 'assistant',
      content: `According to the **Enterprise AI Safety & Governance Blueprint**, Human-in-the-Loop (HITL) intervention is mandatory whenever specific operational thresholds are crossed:

1. **Model Confidence Threshold**:
   * Any inference result where the model confidence score drops below **0.88** automatically triggers a human review queue before downstream execution [1].
2. **Untrusted or Ambiguous Source Material**:
   * If RAG retrieval returns source material below a **0.75 semantic cosine similarity threshold**, or references unverified third-party documents, the automated response is blocked and routed to a compliance reviewer [1].
3. **High-Risk Regulatory Classification**:
   * Under the **EU AI Act Article 9 & 13 crosswalk**, applications classified as 'High Risk' (such as automated credit underwriting or identity triage) require explicit human sign-off on anomalous outcomes [2].

\`\`\`yaml
# Standard HITL Escalation Rules
escalation_triggers:
  confidence_floor: 0.88
  retrieval_similarity_floor: 0.75
  sla_resolution_minutes: 15
  require_audit_hash: true
\`\`\``,
      timestamp: 'Yesterday',
      citations: [
        {
          id: 'cit-201',
          sourceNumber: 1,
          pageNumber: 15,
          sectionHeading: '3.1 Operational Controls',
          snippet: 'Mandatory human intervention workflows when model confidence scores fall below 0.88 or cite low-trust sources.',
          fullPassage: 'Human-in-the-Loop (HITL) Thresholds: Mandatory human intervention workflows are activated when model confidence scores fall below 0.88 or cite low-trust sources with cosine similarity < 0.75. Reviewers must action items within a 15-minute SLA.',
          similarityScore: 0.97
        },
        {
          id: 'cit-202',
          sourceNumber: 2,
          pageNumber: 22,
          sectionHeading: '4.0 Statutory Alignment',
          snippet: 'Mapping high-risk system obligations to Article 9 risk management systems and Article 13 transparency directives.',
          fullPassage: 'Regulatory Compliance & EU AI Act Crosswalk: Systems designated as high-risk under Annex III must uphold Article 9 risk management systems and Article 13 human oversight requirements, prohibiting fully autonomous decisions without audit trails.',
          similarityScore: 0.91
        }
      ]
    }
  ],
  'doc-3': [
    {
      id: 'msg-301',
      documentId: 'doc-3',
      role: 'user',
      content: 'What are the target recovery metrics (RPO/RTO) and how is database replication handled?',
      timestamp: '2 days ago'
    },
    {
      id: 'msg-302',
      documentId: 'doc-3',
      role: 'assistant',
      content: `The **Cloud Infrastructure Migration Strategy** specifies the following disaster recovery and persistence architecture:

* **Disaster Recovery Targets**:
  * **RPO (Recovery Point Objective)**: Under **15 seconds** [1].
  * **RTO (Recovery Time Objective)**: Under **90 seconds** during an abrupt multi-AZ or regional failover [1].
* **Database Replication Architecture**:
  * Leverages **Active-Passive PostgreSQL clusters** orchestrated by **Patroni** with Raft consensus [2].
  * Utilizes streaming Change Data Capture (CDC) and dual-write synchronizers to maintain sub-second replication latency across target cloud availability zones [2].`,
      timestamp: '2 days ago',
      citations: [
        {
          id: 'cit-301',
          sourceNumber: 1,
          pageNumber: 18,
          sectionHeading: '4.5 SLA Validation',
          snippet: 'Verified RPO under 15 seconds and RTO under 90 seconds under simulated regional backbone severance.',
          fullPassage: 'Disaster Recovery & Chaos Testing: Verified RPO under 15 seconds and RTO under 90 seconds under simulated regional backbone severance. Automated failover tests are executed every quarter without client disruption.',
          similarityScore: 0.98
        },
        {
          id: 'cit-302',
          sourceNumber: 2,
          pageNumber: 6,
          sectionHeading: '2.2 Storage & Persistence',
          snippet: 'Active-passive PostgreSQL replication with sub-second lag and automated failover via Patroni and Raft consensus.',
          fullPassage: 'Database Replication Strategy: Active-passive PostgreSQL replication with sub-second lag and automated failover via Patroni and Raft consensus. Dual-write patterns during migration ensure zero loss of transactional integrity.',
          similarityScore: 0.95
        }
      ]
    }
  ]
};

export const MOCK_INSIGHTS: Record<string, InsightData> = {
  'doc-1': {
    documentId: 'doc-1',
    executiveSummary: 'Q3 displayed robust double-digit top-line growth (+28% YoY to $142.8M) backed by expanding enterprise contracts and 124% net retention. Operating efficiency accelerated through automated tooling, producing 320 bps of margin expansion while maintaining a strong balance sheet with $310.5M in liquid capital and positive free cash flows.',
    metadata: {
      readingTimeMinutes: 14,
      extractedKeywordsCount: 84,
      totalParagraphs: 112
    },
    keyTopics: [
      { id: 'kt-1', name: 'Revenue Expansion (+28% YoY)', relevance: 98, pageOccurrences: [1, 4, 8, 24], category: 'financial' },
      { id: 'kt-2', name: 'Enterprise SaaS Retention (124% NRR)', relevance: 92, pageOccurrences: [4, 8, 9], category: 'strategy' },
      { id: 'kt-3', name: 'Operating Margin Expansion (22.1%)', relevance: 88, pageOccurrences: [1, 12, 13], category: 'financial' },
      { id: 'kt-4', name: 'Agentic AI & R&D Capital ($28.4M)', relevance: 84, pageOccurrences: [12, 14, 15], category: 'technical' },
      { id: 'kt-5', name: 'Balance Sheet Liquidity ($310.5M Cash)', relevance: 82, pageOccurrences: [18, 19], category: 'core' }
    ],
    importantConcepts: [
      {
        id: 'ic-1',
        term: 'Net Revenue Retention (NRR)',
        definition: 'Metric measuring the percentage of recurring revenue retained from existing customers over a period, accounting for upgrades, downgrades, and churn (124% in Q3).',
        pageNumber: 8
      },
      {
        id: 'ic-2',
        term: 'Non-GAAP Operating Margin',
        definition: 'Operating income excluding non-cash stock-based compensation and one-off acquisition amortization, expanding 320 bps to 22.1%.',
        pageNumber: 12
      },
      {
        id: 'ic-3',
        term: 'Free Cash Flow (FCF)',
        definition: 'Cash generated by operations minus capital expenditures, standing at $34.2M for the third quarter.',
        pageNumber: 18
      },
      {
        id: 'ic-4',
        term: 'R&D Allocation to AI Automation',
        definition: 'Strategic deployment of engineering capital into autonomous document processing and inference acceleration.',
        pageNumber: 12
      }
    ],
    documentStructure: [
      {
        id: 'ds-1',
        title: '1.0 Executive Summary & Shareholder Letter',
        pageNumber: 1,
        subSections: [
          { title: 'Quarterly Milestones & Macro Climate', pageNumber: 1 },
          { title: 'Core Financial Summary Table', pageNumber: 3 }
        ]
      },
      {
        id: 'ds-2',
        title: '2.0 Consolidated Financial Statements',
        pageNumber: 4,
        subSections: [
          { title: 'Revenue & Gross Margin Walkthrough', pageNumber: 4 },
          { title: 'Geographic and Channel Distribution', pageNumber: 6 }
        ]
      },
      {
        id: 'ds-3',
        title: '3.0 Segmental & Cohort Performance',
        pageNumber: 8,
        subSections: [
          { title: 'Enterprise ARR Acceleration', pageNumber: 8 },
          { title: 'Net Revenue Retention & Cohort Expansion', pageNumber: 10 }
        ]
      },
      {
        id: 'ds-4',
        title: '4.0 Operating Expenses & Efficiency',
        pageNumber: 12,
        subSections: [
          { title: 'R&D Breakdown & Agentic Tooling', pageNumber: 12 },
          { title: 'Sales & Marketing Efficiency Ratios', pageNumber: 15 }
        ]
      },
      {
        id: 'ds-5',
        title: '5.0 Balance Sheet, Liquidity & Capital Allocation',
        pageNumber: 18,
        subSections: [
          { title: 'Cash & Short-Term Equivalents Position', pageNumber: 18 },
          { title: 'CapEx & Free Cash Flow Conversion', pageNumber: 20 }
        ]
      },
      {
        id: 'ds-6',
        title: '6.0 Forward-Looking Outlook & FY Guidance',
        pageNumber: 24,
        subSections: [
          { title: 'Q4 Projections ($151M - $154.5M)', pageNumber: 24 },
          { title: 'Risk Factors & Statutory Disclaimers', pageNumber: 24 }
        ]
      }
    ],
    suggestedQuestions: [
      'What contributed most to the 320 bps operating margin expansion?',
      'How does the 124% NRR compare with previous quarterly cohorts?',
      'What are the forward-looking revenue guidance projections for Q4?',
      'Break down the capital expenditure and R&D spending allocations.'
    ]
  },
  'doc-2': {
    documentId: 'doc-2',
    executiveSummary: 'This blueprint establishes enterprise-wide architectural and statutory controls for LLM deployments. It institutes mandatory automated red-teaming, human-in-the-loop triggers for low confidence (<0.88), immutable forensic audit logging, and direct adherence to EU AI Act Article 9 & 13 requirements.',
    metadata: {
      readingTimeMinutes: 22,
      extractedKeywordsCount: 118,
      totalParagraphs: 184
    },
    keyTopics: [
      { id: 'kt-21', name: 'Automated Red-Teaming Suites', relevance: 96, pageOccurrences: [7, 8, 9], category: 'technical' },
      { id: 'kt-22', name: 'Human-in-the-Loop Thresholds (<0.88)', relevance: 94, pageOccurrences: [15, 16], category: 'core' },
      { id: 'kt-23', name: 'EU AI Act Article 9/13 Compliance', relevance: 91, pageOccurrences: [22, 23, 25], category: 'strategy' },
      { id: 'kt-24', name: 'Cryptographic Audit Trails & Hashing', relevance: 85, pageOccurrences: [31, 32], category: 'technical' }
    ],
    importantConcepts: [
      {
        id: 'ic-21',
        term: 'Adversarial Prompt Injection Defense',
        definition: 'Systematic input sanitization and multi-agent guardrails designed to prevent jailbreaking and unauthorized tool execution.',
        pageNumber: 7
      },
      {
        id: 'ic-22',
        term: 'Human-in-the-Loop (HITL) Gate',
        definition: 'Operational safety workflow requiring verified human sign-off whenever model inference confidence is below 0.88.',
        pageNumber: 15
      },
      {
        id: 'ic-23',
        term: 'Statutory Traceability Matrix',
        definition: 'Documented linkage mapping model architecture decisions to ISO 42001 and EU AI Act regulatory articles.',
        pageNumber: 22
      }
    ],
    documentStructure: [
      {
        id: 'ds-21',
        title: '1.0 Foundational Governance & Risk Scope',
        pageNumber: 1,
        subSections: [{ title: 'Risk Categorization & Taxonomy', pageNumber: 3 }]
      },
      {
        id: 'ds-22',
        title: '2.0 Dynamic Threat Modeling & Red-Teaming',
        pageNumber: 7,
        subSections: [{ title: 'Automated Jailbreak Generation', pageNumber: 8 }]
      },
      {
        id: 'ds-23',
        title: '3.0 Human Oversight & Escalation Procedures',
        pageNumber: 15,
        subSections: [{ title: 'Confidence Scoring Floor (0.88)', pageNumber: 15 }]
      },
      {
        id: 'ds-24',
        title: '4.0 Regulatory Compliance & EU AI Act Crosswalk',
        pageNumber: 22,
        subSections: [{ title: 'High-Risk System Obligations', pageNumber: 24 }]
      }
    ],
    suggestedQuestions: [
      'What specific criteria trigger mandatory human escalation?',
      'How does the blueprint address EU AI Act transparency rules?',
      'What cryptographic safeguards ensure forensic log immutability?',
      'Explain the automated red-teaming test methodology.'
    ]
  },
  'doc-3': {
    documentId: 'doc-3',
    executiveSummary: 'Outlines the technical blueprint for moving mission-critical enterprise systems to distributed multi-cloud Kubernetes clusters with sub-second replication latency, active-passive PostgreSQL failover, zero-trust network encryption, and proven 15s RPO / 90s RTO SLAs.',
    metadata: {
      readingTimeMinutes: 12,
      extractedKeywordsCount: 65,
      totalParagraphs: 90
    },
    keyTopics: [
      { id: 'kt-31', name: 'Zero-Downtime Data Migration', relevance: 95, pageOccurrences: [6, 7], category: 'technical' },
      { id: 'kt-32', name: 'PostgreSQL Patroni Clustering', relevance: 92, pageOccurrences: [6, 8], category: 'technical' },
      { id: 'kt-33', name: 'Disaster Recovery: 15s RPO / 90s RTO', relevance: 89, pageOccurrences: [18], category: 'core' },
      { id: 'kt-34', name: 'Cilium eBPF & Istio mTLS 1.3', relevance: 86, pageOccurrences: [11, 13], category: 'strategy' }
    ],
    importantConcepts: [
      {
        id: 'ic-31',
        term: 'Patroni Raft Consensus',
        definition: 'Distributed configuration management system enabling automatic leader election and zero-loss failover for PostgreSQL databases.',
        pageNumber: 6
      },
      {
        id: 'ic-32',
        term: 'Recovery Point Objective (RPO)',
        definition: 'Maximum acceptable targeted amount of data loss measured in time (15 seconds target in this strategy).',
        pageNumber: 18
      },
      {
        id: 'ic-33',
        term: 'eBPF Micro-Segmentation',
        definition: 'Kernel-level packet filtering providing performant cryptographic identity enforcement without sidecar proxy overhead.',
        pageNumber: 11
      }
    ],
    documentStructure: [
      {
        id: 'ds-31',
        title: '1.0 Target Architecture & Migration Phases',
        pageNumber: 1,
        subSections: [{ title: 'Milestones & Cutover Windows', pageNumber: 3 }]
      },
      {
        id: 'ds-32',
        title: '2.0 Storage, State & Data Persistence',
        pageNumber: 6,
        subSections: [{ title: 'Patroni PostgreSQL Replication', pageNumber: 7 }]
      },
      {
        id: 'ds-33',
        title: '3.0 Zero-Trust Mesh & Network Isolation',
        pageNumber: 11,
        subSections: [{ title: 'mTLS 1.3 & Cilium Security Policies', pageNumber: 12 }]
      },
      {
        id: 'ds-34',
        title: '4.0 Chaos Verification & Disaster Recovery',
        pageNumber: 18,
        subSections: [{ title: 'RPO/RTO Validation Metrics', pageNumber: 18 }]
      }
    ],
    suggestedQuestions: [
      'What are the disaster recovery RPO and RTO guarantees?',
      'How does Patroni handle split-brain consensus failures?',
      'What network isolation guarantees are provided by eBPF?',
      'What are the planned maintenance cutover windows?'
    ]
  }
};

export const INITIAL_SAVED_ITEMS: SavedItem[] = [
  {
    id: 'save-1',
    documentId: 'doc-1',
    documentName: 'Q3 Financial & Operational Report.pdf',
    title: 'Enterprise ARR & Net Retention Rate',
    snippet: 'Enterprise SaaS ARR grew 34% to $108.2M, driven by 124% net revenue retention among Fortune 500 cohorts.',
    pageNumber: 8,
    savedAt: 'Today, 10:16 AM',
    type: 'citation',
    tags: ['Finance', 'ARR', 'Q3']
  },
  {
    id: 'save-2',
    documentId: 'doc-2',
    documentName: 'Enterprise AI Safety & Governance Blueprint.pdf',
    title: 'Human-in-the-Loop 0.88 Floor Rule',
    snippet: 'Mandatory human intervention workflows when model confidence scores fall below 0.88 or cite low-trust sources.',
    pageNumber: 15,
    savedAt: 'Yesterday, 3:45 PM',
    type: 'citation',
    tags: ['Safety', 'Governance', 'HITL']
  },
  {
    id: 'save-3',
    documentId: 'doc-3',
    documentName: 'Cloud Infrastructure Migration Strategy.pdf',
    title: 'High Availability DR Thresholds',
    snippet: 'Verified RPO under 15 seconds and RTO under 90 seconds under simulated regional backbone severance.',
    pageNumber: 18,
    savedAt: '2 days ago',
    type: 'citation',
    tags: ['Infra', 'SLAs', 'Disaster Recovery']
  }
];
