import React from "react";
import profilePhoto from "../assets/myprofilephoto.jpg";

function Home({ contactRef }) {
  const resumeLink = "https://drive.google.com/file/d/1ODdXYp00kFxRqvALrgByMSpYcOiPzuCX/view?usp=sharing"; // Your actual resume link


  const scrollToContact = () => {
    if (contactRef && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="bg-black text-white text-center py-16 w-full flex flex-col items-center gap-6 border-4 border-purple-700 px-4 sm:px-6 md:px-12 lg:px-24">
      

      <img
        src={profilePhoto}
        alt="Jameslurtin Veeraraj's Profile"
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-full transition-transform duration-300 hover:scale-105"
      />


      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
        Hi, I'm <span className="text-green-400">Jameslurtin Veeraraj</span>.
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl px-4 sm:px-0">
        Pursuing a Master’s in Software Engineering at EPITA School of Engineering, Paris, France.
      </p>

  
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 w-full sm:w-auto">
      
  
        <a
          href={resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-green-500 to-red-600 px-6 py-3 text-sm sm:text-base font-semibold hover:bg-red-500 hover:text-black transition-all duration-300 cursor-pointer"
          aria-label="View Resume"
        >
          Resume
        </a>
      </div>
    </main>
  );
}

export default Home;
