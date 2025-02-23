import React from 'react';

function Contactform() {
    return (
        <div className="bg-black text-white text-center py-16 w-full min-h-screen border-4 border-purple-700 flex flex-col items-center gap-10 px-6">
            
            
            <h2 className="text-2xl sm:text-3xl">Contact Me</h2>

            
            <div className="bg-gray-400 w-full max-w-lg rounded-3xl p-6 text-black shadow-lg hover:scale-105 transition-transform duration-300">
                
                <p>Email: jameslurtin@gmail.com</p>
                <p>Phone: +33 780 829 9271</p>
                <p>WhatsApp: +91 99522 71426</p>

                <p className="mt-4">GitHub:</p>
                <a
                    href="https://github.com/Jameslurtin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900 underline hover:text-black"
                >
                    github.com/Jameslurtin
                </a>

                <p className="mt-4">LinkedIn:</p>
                <a
                    href="https://www.linkedin.com/in/jameslurtin-veeraraj-a439231a7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900 underline hover:text-black"
                >
                    linkedin.com/in/jameslurtin-veeraraj
                </a>

            </div>
        </div>
    );
}

export default Contactform;
