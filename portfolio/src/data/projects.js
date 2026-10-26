const projects = [
  {
    "id": "rag-document-assistant",
    "name": "RAG Document Assistant",
    "short": "Ask natural-language questions about your documents.",
    "description": "Built and deployed an end-to-end document Q&A application with a retrieval-augmented generation workflow.",
    "technologies": [
      "Python",
      "RAG",
      "LLM"
    ],
    "features": [
      "Document upload and natural-language questions",
      "Retrieves relevant document context before generating answers",
      "Answers validated against source documents for grounding and accuracy"
    ],
    "live": "https://rag-document-assistant-1-nr8a.onrender.com/"
  },
  {
    "id": "friday",
    "name": "FRIDAY — Local AI Voice Assistant",
    "short": "A modular voice agent powered by local AI.",
    "description": "An end-to-end voice workflow combining speech-to-text, local LLM processing, conversation context and text-to-speech.",
    "technologies": [
      "Python",
      "Llama 3.2",
      "Ollama",
      "Voice AI"
    ],
    "features": [
      "Speech-to-text input",
      "Local LLM processing with conversation context",
      "Text-to-speech responses"
    ],
    "github": "https://github.com/Jameslurtin/Friday_Ai"
  },
  {
    "id": "ai-email-agent",
    "name": "AI Email Reply Agent",
    "short": "Context-aware email replies with Gemini and Gmail.",
    "description": "An AI-assisted email workflow that reads Gmail messages, generates context-aware replies with Gemini and sends responses through the Gmail API.",
    "technologies": [
      "FastAPI",
      "React",
      "Gemini API",
      "Gmail API",
      "OAuth 2.0"
    ],
    "features": [
      "Reads Gmail messages through authenticated API access",
      "Generates contextual replies with Gemini",
      "Responses and API actions tested for recipient, context and output correctness"
    ],
    "github": "https://github.com/Jameslurtin/AI-Email-Reply-Agent"
  },
  {
    "id": "support-ticket",
    "name": "AI Support Ticket Assistant",
    "short": "Turn incoming support tickets into actionable suggestions.",
    "description": "A full-stack AI application that classifies support tickets and generates priorities, summaries and suggested actions.",
    "technologies": [
      "FastAPI",
      "React",
      "Llama 3.2"
    ],
    "github": "https://github.com/Jameslurtin/ai-support-ticket-assistant"
  },
  {
    "id": "telehealth-ehr",
    "name": "Telehealth Secure EHR Platform",
    "short": "A healthcare platform with authenticated, role-based access.",
    "description": "Developed a healthcare platform with 14 documented REST endpoints, MySQL, JWT authentication and role-based access control.",
    "technologies": [
      "React",
      "Django",
      "REST APIs",
      "MySQL",
      "AWS",
      "Docker"
    ],
    "features": [
      "14 documented REST endpoints",
      "JWT authentication",
      "Role-based access control"
    ]
  }
];

export default projects;
