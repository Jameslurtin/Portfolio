import { profile } from "../data/profile";
import { safeLink } from "../lib/preferences";
import { useLanguage } from "../lib/Language";

function Footer() {
  const { t, language, changeLanguage } = useLanguage();
    return (
        <footer className="bg-black/90 border-t border-white/10 py-8 mt-12">
            <div className="max-w-6xl mx-auto text-center text-gray-400 px-4">
                <nav className="footer-navigation" aria-label={t("Footer navigation")}>
                    <a href="#home">Jameslurtin Veeraraj</a>
                    <a href="#about">{t("About")}</a>
                    <a href="#projects">{t("Projects")}</a>
                    <a href="#contact">{t("Contact")}</a>
                    <a href={safeLink(profile.github)} target="_blank" rel="noreferrer">GitHub</a>
                    <a href={safeLink(profile.linkedin)} target="_blank" rel="noreferrer">LinkedIn</a>
                    <a href={`?lang=${language === "en" ? "fr" : "en"}${window.location.hash}`} lang={language === "en" ? "fr" : "en"} hrefLang={language === "en" ? "fr" : "en"} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); changeLanguage(language === "en" ? "fr" : "en"); }}>{language === "en" ? "Français" : "English"}</a>
                </nav>
                <p>© {new Date().getFullYear()} {t("Jameslurtin Veeraraj — Software Engineer · MSc student, EPITA")}</p>
                <p className="mt-2">{t("Located in Paris, France • Available for internships")}</p>
            </div>
        </footer>
    );
}

export default Footer;
