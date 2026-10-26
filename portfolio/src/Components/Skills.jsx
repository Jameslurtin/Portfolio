import { useLanguage } from "../lib/Language";

const categories = [
  {
    "title": "AI & Automation",
    "items": [
      "RAG",
      "LLM applications",
      "AI agents",
      "Voice AI",
      "MCP concepts",
      "LangChain",
      "Gemini API",
      "OpenAI API",
      "Llama 3.2",
      "Ollama",
      "Prompt engineering",
      "n8n"
    ]
  },
  {
    "title": "Programming",
    "items": [
      "Python",
      "TypeScript",
      "JavaScript (ES6+)",
      "Java",
      "SQL",
      "C/C++"
    ]
  },
  {
    "title": "Backend & APIs",
    "items": [
      "FastAPI",
      "Django",
      "Django REST Framework",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Pydantic",
      "JWT",
      "OAuth 2.0",
      "Gmail API"
    ]
  },
  {
    "title": "Frontend",
    "items": [
      "React.js",
      "Vite",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "React Hooks"
    ]
  },
  {
    "title": "Data, Cloud & DevOps",
    "items": [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "SQLite",
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "CI/CD"
    ]
  },
  {
    "title": "Engineering",
    "items": [
      "Git",
      "GitHub",
      "API testing",
      "Postman",
      "Debugging",
      "Technical documentation",
      "Agile/Scrum"
    ]
  }
];

function Skills() {
  const { t } = useLanguage();
    return (
        <section className="bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <p className="text-purple-400 font-medium mb-3">{t("Skills")}</p>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t("Engineering Skills")}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((c) => (
                        <div key={c.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h4 className="font-semibold mb-3">{t(c.title)}</h4>
                            <ul className="list-inside list-disc text-gray-300 space-y-1">
                                {c.items.map((it) => (
                                    <li key={it}>{t(it)}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Skills;
