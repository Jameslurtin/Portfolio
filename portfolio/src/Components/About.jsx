import React from "react";

function About() {
  return (
    <div className="bg-black text-white text-center py-16 w-full flex flex-col gap-10 h-screen border-4 border-purple-700">
    
      <h2 className="font-bold text-3xl">About Me</h2>

      <p className="px-6 sm:px-12 md:px-20 lg:max-w-[800px] mx-auto text-lg">
        Computer Engineer, organized and dependable, successful at managing multiple priorities with a positive attitude.
        Willing to take on added responsibilities to meet team goals.
        Hardworking and passionate web developer eager to secure an entry-level position.
        Ready to help teams achieve company goals.
      </p>


      <div className="w-full max-w-2xl mx-auto space-y-6">
        {[
          { skill: "HTML & CSS", width: "w-10/12" },
          { skill: "JavaScript", width: "w-10/12" },
          { skill: "ReactJS", width: "w-10/12" },
          { skill: "Tailwind CSS", width: "w-10/12" },
        ].map((item, index) => (
          <div key={index} className="flex items-center">
            <label className="w-2/12 font-semibold">{item.skill}</label>
            <div className="grow bg-gray-800 rounded-full h-2.5">
              <div className={`bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-transform duration-300 hover:scale-105 ${item.width}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-lg">
        <h3 className="text-2xl font-semibold mb-3">Experience:</h3>
        <p className="font-bold text-xl">ReactJS Developer Trainee</p>
        <p><span className="font-semibold">Duration:</span> 6 months</p>
        <p><span className="font-semibold">Company:</span> Altos Technologies</p>
        <p><span className="font-semibold">Location:</span> Kochi, India</p>
      </div>
    </div>
  );
}

export default About;
