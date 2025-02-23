import React, { useRef, useState } from "react";
import Home from "./Home";
import About from "./About";
import Project from "./Project";
import Contactform from "./Contactform";

const Navbar = () => {
  const homeRef = useRef(null);
  const aboutMeRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  
  // Mobile menu state
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false); // Close menu on mobile after clicking
    }
  };

  return (
    <>
    
      <nav className="bg-black text-white px-6 md:px-16 w-full fixed top-0 left-0 z-50">
        <div className="py-3 flex justify-between items-center max-w-6xl mx-auto">
          
  
          <div className="rounded-full bg-slate-500 text-black px-3 py-1 font-bold">
            VJL
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection(homeRef)} className="px-4 py-2 hover:text-green-400">Home</button>
            <button onClick={() => scrollToSection(aboutMeRef)} className="px-4 py-2 hover:text-green-400">About Me</button>
            <button onClick={() => scrollToSection(projectsRef)} className="px-4 py-2 hover:text-green-400">Projects</button>
            <button onClick={() => scrollToSection(contactRef)} className="px-4 py-2 hover:text-green-400">Contact</button>
          </div>

        
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
            ☰
          </button>
        </div>


        {isOpen && (
          <div className="md:hidden flex flex-col space-y-3 bg-gray-900 py-4 text-center">
            <button onClick={() => scrollToSection(homeRef)} className="py-2 hover:text-green-400">Home</button>
            <button onClick={() => scrollToSection(aboutMeRef)} className="py-2 hover:text-green-400">About Me</button>
            <button onClick={() => scrollToSection(projectsRef)} className="py-2 hover:text-green-400">Projects</button>
            <button onClick={() => scrollToSection(contactRef)} className="py-2 hover:text-green-400">Contact</button>
          </div>
        )}
      </nav>

  
      <div ref={homeRef} id="home">
        <Home contactRef={contactRef} />
      </div>
      <div ref={aboutMeRef} id="about-me">
        <About />
      </div>
      <div ref={projectsRef} id="projects">
        <Project />
      </div>
      <div ref={contactRef} id="contact">
        <Contactform />
      </div>
    </>
  );
};

export default Navbar;
