import { useLanguage } from "../lib/Language";
import { useRef, useState } from "react";
import { safeLink } from "../lib/preferences";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import ProjectModal from "./ProjectModal";

export default function ProjectCard({ project, featured, index = 0 }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const github = safeLink(project.github);
  const live = safeLink(project.live);
  const detailsId = `${project.id}-details`;
  const titleId = `${project.id}-title`;
  return (
    <article className="project-folder-card" data-open={open} data-color={index % 3} aria-labelledby={titleId} onClick={event => {
      if (!event.target.closest("a,button,dialog")) setOpen(true);
    }}>
      <div className="folder-card-meta"><span>/{String(index + 1).padStart(2, "0")}</span><span>{featured ? t("Featured") : t("Project")}</span></div>
      <button ref={toggle} type="button" className="project-folder-toggle" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? detailsId : undefined} aria-label={`${t("Open project details")}: ${t(project.name)}`} onClick={() => setOpen(true)}>
        <span className="folder-scene" aria-hidden="true">
          <span className="folder-back"><span className="folder-art" /></span>
          <span className="folder-sheet sheet-back"><span className="sheet-heading">{t(project.technologies[0])}</span><span className="sheet-lines" /></span>
          <span className="folder-sheet sheet-middle"><span className="sheet-heading">{t(project.technologies[1])}</span><span className="sheet-lines" /></span>
          <span className="folder-sheet sheet-front"><span className="sheet-heading">{t("Project overview")}</span><span className="sheet-art" /></span>
          <span className="folder-glass">
            <span className="folder-glass-top">{t("Software project")} <span>↗</span></span>
            <span className="folder-mark">{index === 0 ? "RAG" : index === 1 ? "VOICE" : index === 2 ? "MAIL" : index === 3 ? "SUPPORT" : "EHR"}<span>_</span></span>
            <span className="folder-glass-bottom"><span>{t(open ? "Close details" : "Explore project")}</span><span className="folder-plus">{open ? "−" : "+"}</span></span>
          </span>
        </span>
      </button>
      <div className="folder-card-content">
      <h3 id={titleId}>{t(project.name)}</h3>
      <p className="folder-summary">{t(project.short)}</p>
      <ul className="folder-technologies" aria-label={t("Technologies")}>
        {project.technologies.map((technology) => (
          <li key={technology}>{t(technology)}</li>
        ))}
      </ul>
      {(github || live) && <div className="folder-project-links">
        {github && <a href={github} target="_blank" rel="noopener noreferrer"><FaGithub aria-hidden="true" /> {t("View code")}<span className="sr-only"> {t("for")} {t(project.name)}</span></a>}
        {live && <a href={live} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt aria-hidden="true" /> {t("Live demo")}<span className="sr-only"> {t("of")} {t(project.name)}</span></a>}
      </div>}
      </div>
      {open && <ProjectModal project={project} onClose={() => setOpen(false)} trigger={toggle} />}
    </article>
  );
}
