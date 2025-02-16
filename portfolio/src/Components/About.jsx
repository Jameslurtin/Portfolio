import React from 'react'

function About() {
    return (
        <div className='bg-black text-white text-center py-16 w-full  top-[1000px] left-0 z-50 flex flex-col gap-10 h-screen border-4 border-purple-700   '>
            <div className='font-bold text-2xl' > About me</div>
            <div className='px-40'>
                Computer Engineer Organized and dependable-candidatesuccessful at managing multiple priorities with a positiveattitude.
                Willingness to take on added responsibilities to meetteam goals.
                Hardworking passionate job seeker with Strongorganizational skills eager to secure entry-level web developerposition.
                Ready to help team achieve company goals..
            </div>

            <div className="space-y-4 flex-col gap-7">

                <div className="flex items-center">

                    <label htmlFor="htmlandcss" className="w-2/12">

                        HTML & CSS

                    </label>

                    <div className="grow bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transform transition-transform duration-300 hover:scale-105 w-10/12">



                        </div>

                    </div>

                </div>
                <div className="flex items-center">

                    <label htmlFor="javascript" className="w-2/12">

                        Javascript

                    </label>

                    <div className="grow bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transform transition-transform duration-300 hover:scale-105 w-10/12">



                        </div>

                    </div>

                </div>
                <div className="flex items-center">

                    <label htmlFor="reactjs" className="w-2/12">

                        Reactjs

                    </label>

                    <div className="grow bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transform transition-transform duration-300 hover:scale-105 w-10/12">



                        </div>

                    </div>

                </div>
                <div className="flex items-center">

                    <label htmlFor="tailwindcss" className="w-2/12">

                        Tailwind css

                    </label>

                    <div className="grow bg-gray-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transform transition-transform duration-300 hover:scale-105 w-10/12">



                        </div>

                    </div>

                </div>
               

            </div>
        </div>
    )
}

export default About