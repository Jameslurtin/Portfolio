import React from "react";
import profilePhoto from "../assets/myprofilephoto.jpg";

function Home() {
  return (
    <main className="bg-black text-white text-center py-16 w-full flex flex-col items-center gap-6 border-4 border-purple-700 px-6">

      <img
        src={profilePhoto}
        alt="Profile of Jameslurtin Veeraraj"
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto object-cover rounded-full transition-transform duration-300 hover:scale-105"
      />

    
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        Hi, I am Jameslurtin Veeraraj.
      </h1>
      <p className="text-sm sm:text-base md:text-lg max-w-2xl">
        I am pursuing a Master’s in Software Engineering at EPITA School of Engineering, France (Paris).
      </p>


      <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
        <button
          className="rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 px-5 py-2 text-sm sm:text-base font-semibold hover:text-black transition-colors"
          aria-label="Contact Jameslurtin Veeraraj"
        >
          Contact Me
        </button>
        <button
          className="rounded-2xl bg-gradient-to-r from-green-500 to-red-600 px-5 py-2 text-sm sm:text-base font-semibold hover:text-black transition-colors"
          aria-label="View Resume"
        >
          Resume
        </button>
      </div>
    </main>
  );
}

export default Home;
