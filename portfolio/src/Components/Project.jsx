import React from 'react'
import instLogo from '../Logo/inst logo.png';
import marvelLogo from '../Logo/marvel logo.png';
import whatsLogo from '../Logo/whats logo.png';


function Project() {
  return (
    <div> <h className='flex justify-center bg-black text-white font-bold text-xl'>Projects</h>
      <div className='flex gap-8 p-7  justify-center bg-black font-semibold items-center'>

        <div className='bg-slate-500 w-96  h-96 rounded-3xl flex  justify-center   '>
          <div > Instagaram (Clone)
            <img src={instLogo} alt="logo" className='w-32 h-16  rounded-full pt-2' />
            <a
              href="https://github.com/Jameslurtin/insta-app.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline mt-2 block"
            >
              Visit GitHub Repository
            </a>
            <div className=''>
              A feature-rich replica of Instagram <br /> built with React JS and Tailwind CSS,<br />
              focusing on a responsive <br />  user interface and dynamic components.
              <br /> This project showcases the feed,<br />  profile, and post interactions,<br />
              simulating core functionalities<br />  of the platform.
            </div>
          </div>



        </div>
        <div className='bg-slate-500 w-96 px-2 h-96 rounded-3xl flex justify-center'>
          <div >Marvel Ui/Ux
            <img src={marvelLogo} alt="logo" className='w-32 h-16  rounded-full  pt-2' />
            <a
              href="https://github.com/Jameslurtin/MarvelUi-UX.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline mt-2 block"
            >
              Visit GitHub Repository
            </a>
            <div>
              Marvel's UI/UX using React JS <br></br> and Tailwind CSS,
              designed to replicate<br></br> the sleek and dynamic interface <br></br>of the platform.
              This project highlights <br></br> responsive design,
              interactive components,
              <br></br> and aesthetic visual elements
              <br></br> inspired by Marvel's branding.
            </div>


          </div>


        </div>
        <div className='bg-slate-500 w-96 px-2 h-96 rounded-3xl flex justify-center'>
          <div > Whatsapp(Clone)
            <img src={whatsLogo} alt="logo" className='w-32 h-16  rounded-full  pt-2' />
            <a
              href="https://github.com/Jameslurtin/whatsapp-clone-react.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline mt-2 block"
            >
              Visit GitHub Repository
            </a>
            <div>
              I have created WhatsApp clone Ui/Ux, <br></br>
              developed using React JS and styled <br></br> with Tailwind CSS. <br></br>
              It demonstrates chat interfaces,<br></br> message handling,<br></br>
              and a responsive layout.
            </div>
          </div>

        </div>


      </div>
    </div>
  )
}

export default Project