import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useLanguage } from "../lib/Language";
import { safeLink } from "../lib/preferences";

export default function ProjectModal({ project, onClose, trigger }) {
  const { t } = useLanguage();
  const dialog = useRef(null);
  const backdropPress = useRef(false);
  const github = safeLink(project.github);
  const live = safeLink(project.live);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [trigger]);
  const outside = event => {
    const rect = dialog.current.getBoundingClientRect();
    return event.target === dialog.current && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  };
  return createPortal(
    <dialog ref={dialog} id={`${project.id}-details`} className="project-modal" aria-labelledby={`${project.id}-modal-title`} aria-describedby={`${project.id}-modal-summary`}
      onKeyDown={event => {
        if (event.key !== "Tab") return;
        const controls = [...dialog.current.querySelectorAll('button:not(:disabled), a[href]')];
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onPointerDown={event => { backdropPress.current = outside(event); }}
      onClick={event => { if (backdropPress.current && outside(event)) onClose(); backdropPress.current = false; }}>
      <div className="project-modal-bar"><span>{t("Project overview")}</span><button type="button" className="project-modal-close" onClick={onClose} aria-label={t("Close project details")}>×</button></div>
      <div className="project-modal-content">
        <p className="project-modal-label">{t("Software project")}</p>
        <h2 id={`${project.id}-modal-title`}>{t(project.name)}</h2>
        <p id={`${project.id}-modal-summary`} className="project-modal-summary">{t(project.short)}</p>
        <h3>{t("Technologies")}</h3>
        <ul className="folder-technologies">{project.technologies.map(technology => <li key={technology}>{t(technology)}</li>)}</ul>
        <h3>{t("Project details")}</h3>
        <p className="project-modal-description">{t(project.description)}</p>
        {project.features?.length > 0 && <><h3>{t("Key features")}</h3><ul className="project-modal-features">{project.features.map(feature => <li key={feature}>{t(feature)}</li>)}</ul></>}
        {(github || live) && <div className="folder-project-links">
          {github && <a href={github} target="_blank" rel="noopener noreferrer"><FaGithub aria-hidden="true" />{t("View code")}</a>}
          {live && <a href={live} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt aria-hidden="true" />{t("Live demo")}</a>}
        </div>}
      </div>
    </dialog>, document.body,
  );
}
