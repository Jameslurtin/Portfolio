import React from 'react';

const Navbar = () => {
  return (
    <div className='bg-black text-white px-8 md:px-16 lg:px-24 w-full fixed top-0 left-0 z-50'>
      <div className='py-2 flex justify-center md:justify-between items-center w-full max-w-6xl mx-auto'>
        <div className='rounded-full bg-slate-500 text-black px-2 font-bold'>VJL</div>
        <div className='space-x-6'>
          <a href='#home' className='hover:text-green-400'>Home</a>
          <a href='#about-me' className='hover:text-green-400'>About Me</a>
          <a href='#contact' className='hover:text-green-400'>Contact</a>
          <a href='#projects' className='hover:text-green-400'>Projects</a>
        </div>
        <button className='rounded-2xl bg-gradient-to-r from-green-500 to-red-600 px-4 py-2 hover:text-black'>
          Connect Me
        </button>
      </div>
    </div>
  );
};

export default Navbar;
