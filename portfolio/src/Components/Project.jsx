import React from 'react';
import instLogo from '../Logo/inst logo.png';
import marvelLogo from '../Logo/marvel logo.png';
import whatsLogo from '../Logo/whats logo.png';

function Project() {
  return (
    <div className="bg-black text-white py-12">

      <h2 className="text-center font-bold text-2xl sm:text-3xl mb-10 py-3">Projects</h2>

  
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 px-6 sm:px-12 lg:px-24 items-center">
        
      
        {[
          { 
            title: "Instagram (Clone)", 
            logo: instLogo, 
            link: "https://github.com/Jameslurtin/insta-app.git",
            description: "A feature-rich replica of Instagram built with React JS and Tailwind CSS. Showcases the feed, profile, and post interactions, simulating core functionalities of the platform."
          },
          { 
            title: "Marvel UI/UX", 
            logo: marvelLogo, 
            link: "https://github.com/Jameslurtin/MarvelUi-UX.git",
            description: "Marvel's UI/UX using React JS and Tailwind CSS, designed to replicate a sleek, dynamic interface. Highlights responsive design, interactive components, and aesthetic visual elements."
          },
          { 
            title: "WhatsApp (Clone)", 
            logo: whatsLogo, 
            link: "https://github.com/Jameslurtin/whatsapp-clone-react.git",
            description: "A WhatsApp clone UI/UX developed with React JS and Tailwind CSS. Demonstrates chat interfaces, message handling, and a responsive layout."
          }
        ].map((project, index) => (
          <div key={index} className="bg-slate-600 w-full max-w-lg p-6 rounded-3xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
            
      
            <h3 className="font-semibold text-xl mb-3">{project.title}</h3>

      
            <img src={project.logo} alt={`${project.title} Logo`} className="w-24 h-16 rounded-full mb-4" />

      
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline font-medium mb-3"
            >
              Visit GitHub Repository
            </a>

        
            <p className="text-sm sm:text-base">{project.description}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Project;
