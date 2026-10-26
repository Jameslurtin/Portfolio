import { profile } from "../data/profile";
import { safeLink } from "../lib/preferences";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../lib/Language";

const links = ["Home", "About", "Skills", "Experience", "Projects", "Education", "Contact"];

export default function Navbar() {
  const { t, language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("home");
  const toggle = useRef(null);
  useEffect(() => {
    let frame;
    const update = () => {
      const sections = [...document.querySelectorAll("main > section[id]")];
      const current = sections.filter(section => section.getBoundingClientRect().top <= 120).at(-1);
      const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? "contact" : current?.id || "home");
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const dismiss = event => { if (!event.target.closest(".site-header")) setIsOpen(false); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [isOpen]);
  return (
    <header className="site-header" onKeyDown={event => { if (event.key === "Escape") { setIsOpen(false); toggle.current?.focus(); } }}>
      <a className="site-logo" href="#home" onClick={() => setIsOpen(false)}>Jameslurtin Veeraraj<span aria-hidden="true">_</span></a>
      <button ref={toggle} className="menu-toggle" aria-label={t(isOpen ? "Close navigation" : "Open navigation")} aria-expanded={isOpen} aria-controls="site-navigation" onClick={() => setIsOpen(!isOpen)}>{isOpen ? `${t("Close")} ×` : "Menu ☰"}</button>
      <nav id="site-navigation" aria-label={t("Main navigation")} className={isOpen ? "site-nav is-open" : "site-nav"}>
        {links.map(label => <a key={label} href={`#${label.toLowerCase()}`} aria-current={active === label.toLowerCase() ? "location" : undefined} onClick={() => setIsOpen(false)}>{t(label)}</a>)}
        <a href={safeLink(profile.github)} target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)}>GitHub</a>
        <a href={`?lang=${language === "en" ? "fr" : "en"}${window.location.hash}`} lang={language === "en" ? "fr" : "en"} hrefLang={language === "en" ? "fr" : "en"} aria-label={language === "en" ? "Passer en français" : "Switch to English"} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); changeLanguage(language === "en" ? "fr" : "en"); setIsOpen(false); }}>{language === "en" ? "FR" : "EN"}</a>
        <a className="nav-cv" href={safeLink(profile.resume)} target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)}>{t("Download CV")} ↗</a>
      </nav>
    </header>
  );
}
