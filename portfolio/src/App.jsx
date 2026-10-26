import "./App.css";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import Project from "./Components/Project";
import Contactform from "./Components/Contactform";
import Experience from "./Components/Experience";
import Skills from "./Components/Skills";
import Education from "./Components/Education";
import Footer from "./Components/Footer";
import PortfolioEffects from "./Components/PortfolioEffects";
import { useLanguage } from "./lib/Language";

function App() {
  const { t } = useLanguage();
  return (
    <div className="portfolio-shell">
      <a className="skip-link" href="#main-content">{t("Skip to content")}</a>
      <PortfolioEffects />
      <Navbar />

      <main id="main-content">
        <section id="home">
          <Home />
        </section>

        <section id="about">
          <About />
        </section>

        <section id="skills">
          <Skills />
        </section>

        <section id="experience">
          <Experience />
        </section>

        <section id="projects">
          <Project />
        </section>

        <section id="education">
          <Education />
        </section>

        <section id="contact">
          <Contactform />
        </section>
      </main>

      <Footer />
      <aside className="hire-float" aria-label={t("Internship availability")}>
        <span className="available-badge"><span className="status-dot" />{t("Available for an internship")}</span>
        <a className="button-primary" href="#contact">{t("Hire Me")} <span aria-hidden="true">↗</span></a>
      </aside>
    </div>
  );
}

export default App;
