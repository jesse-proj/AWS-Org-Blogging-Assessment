import React, { useEffect } from 'react';
import Hero from './Hero';
import Footer from './Footer';
import '../styles/About.css';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='about-page'>
      <Hero
        compact
        imageUrl='/home_hero.png'
        title='About'
        subtitle='Welcome to my cozy corner of the internet'
        showBio={false}
        showPublish={false}
      />

      <main className='about-container'>
        <article className='about-card'>
          <header className='about-header'>
            <h1 className='about-title'>Hello & Welcome</h1>
          </header>

          <div className='about-text-content'>
            <p>
              Welcome to my corner of the web! This blog serves as a personal notebook and 
              archive for ideas, technical explorations, and creative coding journeys. It's 
              built with an emphasis on craftsmanship, nostalgic retro-inspired visuals, and 
              modern full-stack web standards.
            </p>
            <p>
              Whether exploring cloud architectures, diving into game development mechanics, or 
              crafting responsive user interfaces, this platform is where I document what I 
              discover along the way. I believe that writing in the open helps clarify thinking 
              and fosters genuine learning.
            </p>
            <p>
              Technology is most exciting when it combines technical curiosity with creative expression. 
              Here, you'll find everything from architectural notes and deep dives to casual essays and 
              project postmortems.
            </p>
            <p>
              Take your time exploring the posts, feel free to leave thoughts and feedback on any 
              article, and reach out through the links below if you ever want to connect. 
              Thanks for dropping by!
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
