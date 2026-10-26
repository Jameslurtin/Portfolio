import { useLanguage } from "../lib/Language";
import projects from "../data/projects";
import ProjectCard from "./ProjectCard";
import "./ProjectFolders.css";

function Project() {
  const { t } = useLanguage();
  return (
    <section className="bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <p className="text-purple-400 font-medium mb-3">{t("Selected work")}</p>
        <h2 className="font-bold text-3xl sm:text-4xl mb-8">{t("AI applications, built end to end")}</h2>

        <div className="project-collection-label">
          <span>{t("Project collection")} / {String(projects.length).padStart(2, "0")}</span>
          <span>{t("Open a folder to explore")}</span>
        </div>
        <div className="project-folder-grid">
          {projects.map((p, index) => (
            <ProjectCard key={p.id} project={p} index={index} featured={index < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Project;
