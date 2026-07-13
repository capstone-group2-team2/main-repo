# 🤖 Intelligent Reception & Support Agent API | Capstone Project

An integrated solution featuring a centralized **FastAPI Reception Gateway** linked to an asynchronous intent classification backend, paired alongside a closed-domain localized **Bilingual Support Agent** powered via **Groq Cloud API**.



CAPSTONE/
└── main-repo/
    ├── .env                             # Local environment variables and secure API credentials
    ├── cleaned_customer_support_faqs.csv # Raw cleaned dataset containing standard FAQ pairs
    ├── groq_context.txt                 # Packaged monolithic context artifact for Groq Cloud
    ├── ingest.py                        # Service pipeline utility for CSV parsing and context rebuilding
    ├── LICENSE                          # Repository license agreement
    ├── README.md                        # Primary project documentation (This file)
    ├── reception.py                     # FastAPI edge routing and processing microservice
    ├── support_agent.py                 # Core Bilingual (Arabic/English) LLM support engine
    └── TEAM_CONTRACT.md                 # Team development rules and role management document