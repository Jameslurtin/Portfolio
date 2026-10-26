import { useLanguage } from "../lib/Language";
import projects from "../data/projects";
export default function About() {
  const { t } = useLanguage();
  return (
    <section className="bg-black text-white py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <p className="text-purple-400 font-medium mb-3">{t("About")}</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t("Practical AI. Useful software.")}</h2>
        <div className="about-layout">
        <div className="max-w-3xl space-y-5 text-gray-300 text-lg leading-8">
          <p>{t("I am a final-year MSc Software Engineering student at EPITA in Paris, focused on AI automation, LLM applications and Python full-stack development. I enjoy turning manual workflows into useful software.")}</p>
          <p>{t("My projects span document question answering with RAG, local voice AI, email automation and support-ticket assistance. I build end-to-end applications with Python, FastAPI, React, REST APIs and LLM integrations, and I am familiar with Model Context Protocol (MCP) concepts.")}</p>
          <p>{t("I am seeking a six-month, full-time final-year internship, available immediately with an EPITA convention de stage.")}</p>
          <p className="text-purple-300">{t("Paris, France · English B2+ · French A2, actively improving")}</p>
        </div>
        <dl className="about-stats">
          <div><dt>{t("Selected projects")}</dt><dd>{projects.length}</dd></div>
          <div><dt>{t("Months of training")}</dt><dd>6</dd></div>
          <div><dt>{t("English")}</dt><dd>B2+</dd></div>
          <div><dt>{t("French")}</dt><dd>A2</dd></div>
        </dl>
        </div>
      </div>
    </section>
  );
}
