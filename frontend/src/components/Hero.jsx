import React from 'react';
import InvertedFillet from './InvertedFillet';
import BioWindow from './BioWindow';
import '../styles/Hero.css';


export default function Hero() {
  return (
    <div>  
      <div id='home' className='hero-card'>
        <header className='hero-tab hero-tab-nav'>
          <nav className='hero-nav-links'>
            <a className='selected-nav-link hero-nav-link'> Are you me? </a>
            <a className='hero-nav-link'> Login </a>
            <a className='hero-nav-link'> Register </a>
          </nav>

          <InvertedFillet type='nav-tr' className='fillet-nav-tr' />
        </header>

        <div className='hero-tab hero-tab-comms'>
          <nav className='hero-nav-links'>
            <a className='hero-nav-link'> About </a>
          </nav>

          <InvertedFillet type='comms-tl' className='fillet-comms-tl' />
        </div>

        <div className='hero-tab hero-tab-brand'>
          <h1 className='hero-brand-title'>
            Blog Posts
          </h1>

          <p> All my blog posts are super duper cool </p>
          <p style={{margin:0}}> and amazing. Read them all! </p>

          <InvertedFillet type='brand-br' className='fillet-brand-br' />
        </div>

        <div className='bio-window-container'>
          <BioWindow />
        </div>
      </div>
    </div>
  );
}
