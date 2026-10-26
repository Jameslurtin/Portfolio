import { createContext, useContext, useEffect, useState } from "react";
import french from "../data/french";
import { readLanguage } from "./preferences";

const Language = createContext(null);
function initialLanguage() {
  let stored;
  try { stored = localStorage.getItem("portfolio-language"); } catch { /* Storage is optional. */ }
  return readLanguage(window.location.search, stored);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage);
  const t = text => language === "fr" ? french[text] ?? text : text;
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "fr" ? "Jameslurtin Veeraraj — Ingénieur logiciel | IA & Python" : "Jameslurtin Veeraraj — Software Engineer | AI & Python";
    const description = language === "fr"
      ? "Étudiant en dernière année de MSc à EPITA, Paris. Applications IA, assistants RAG et développement full-stack Python. Disponible pour un stage de six mois."
      : "Final-year MSc student at EPITA, Paris building AI applications, RAG assistants and Python full-stack software. Available for a six-month internship.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    try { localStorage.setItem("portfolio-language", language); } catch { /* Storage is optional. */ }
  }, [language]);
  useEffect(() => {
    const onPopState = () => setLanguage(initialLanguage());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  function changeLanguage(next) {
    if (!["en", "fr"].includes(next)) return;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.pushState({}, "", url);
    setLanguage(next);
  }
  return <Language.Provider value={{ language, t, changeLanguage }}>{children}</Language.Provider>;
}

export function useLanguage() { return useContext(Language); }
