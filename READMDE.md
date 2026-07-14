# SYNOVA Workflow
Synova/
│
├── backend/
│   ├── api/
│   ├── agents/
│   │   ├── customer/
│   │   ├── employee/
│   │   ├── receptionist/
│   │   ├── orchestrator/
│   │   └── shared/
│   │
│   ├── services/
│   │   ├── sentiment/
│   │   ├── rag/
│   │   ├── email/
│   │   ├── meeting/
│   │   ├── auth/
│   │   └── storage/
│   │
│   ├── core/
│   ├── schemas/
│   ├── utils/
│   ├── dependencies/
│   ├── database/
│   ├── main.py
│   └── requirements.txt
│
├── models/
│   ├── sentiment/
│   ├── intent/
│   └── embeddings/
│
├── frontend/
├── datapipeline/
├── docs/
├── tests/
├── docker/
└── README.md

# Employee Workflow

Employee Login
        │
        ▼
Reception Agent
        │
        │ receives:
        │ "I can't access the VPN and nobody is helping me!"
        │
        ├──────────────────────┐
        ▼                      ▼
Intent Classifier        Sentiment Service
        │                      │
        │                      │
        ▼                      ▼
technical_issue          negative
        │                      │
        └──────────────┬───────┘
                       ▼
               Decision Engine
                        │
                ┌────────┴────────┐
                ▼                 ▼
            Escalate         AI Processing
            to Human               │
                                    ▼
                        Technical Agent
                                OR
                            HR Agent
                                    │
                                    ▼
                                RAG
                                    │
                                    ▼
                                Response
                                    │
                                    ▼
                                QA Agent
                                    │
                                    ▼
                            Ticket Agent
                                    │
                                    ▼
                                Dashboard