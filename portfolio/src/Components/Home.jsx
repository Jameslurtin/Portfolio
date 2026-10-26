import { profile } from "../data/profile";
import { safeLink } from "../lib/preferences";
import { useLanguage } from "../lib/Language";
import { FaGithub, FaLinkedin, FaArrowRight, FaDownload } from "react-icons/fa";
import profilePhoto from "../assets/profile-jameslurtin.jpeg";
import Typewriter from "./Typewriter";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="hero-layout">
      <div className="hero-content">
        <p className="hero-tag"><span /> {t("Available for a 6-month internship")}</p>
        <p className="eyebrow">{t("Software engineering · Paris, France")}</p>
        <h1>{t("Jameslurtin")}<span>{t("Veeraraj")}<span className="hero-period">.</span></span></h1>
        <p className="hero-role"><span aria-hidden="true">$ </span><Typewriter /></p>
        <p className="hero-description">{t("Final-year MSc Software Engineering student at EPITA, Paris. I build practical AI applications with Python, FastAPI and React — from document Q&A and local voice agents to email and support automation.")}</p>
        <ul className="hero-pills" aria-label={t("Core technologies")}>{["Python", "FastAPI", "React", "RAG", "LLM applications"].map(skill => <li key={skill}>{t(skill)}</li>)}</ul>
        <div className="hero-actions">
          <a className="button-primary" href="#projects">{t("Explore projects")} <FaArrowRight aria-hidden="true" /></a>
          <a className="button-outline" href={safeLink(profile.resume)} target="_blank" rel="noreferrer">{t("Download CV")} <FaDownload aria-hidden="true" /></a>
        </div>
        <div className="hero-social">
          <a href={safeLink(profile.github)} target="_blank" rel="noreferrer"><FaGithub aria-hidden="true" /> {t("GitHub")}</a>
          <a href={safeLink(profile.linkedin)} target="_blank" rel="noreferrer"><FaLinkedin aria-hidden="true" /> {t("LinkedIn")}</a>
        </div>
      </div>
      <div className="portrait-panel">
        <div className="portrait-topline"><span>{t("PROFILE / 01")}</span><span className="status-dot" /></div>
        <div className="portrait-image"><img src={profilePhoto} alt={t("Jameslurtin Veeraraj")} width="360" height="430" fetchPriority="high" /><span className="scan-line" aria-hidden="true" /></div>
        <div className="portrait-caption"><span>{t("BUILDING USEFUL SOFTWARE")}</span><span>{t("PARIS, FRANCE")}</span></div>
      </div>
      <a href="#about" className="hero-scroll">{t("01 — Discover my work")} <span aria-hidden="true">↓</span></a>
    </div>
  );
}
