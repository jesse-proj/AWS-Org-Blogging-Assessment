import React from 'react';
import { NavLink } from 'react-router-dom';
import InvertedFillet from '../InvertedFillet';

export default function HeroNavTab() {
  return (
    <header className='hero-tab hero-tab-nav'>
      <nav className='hero-nav-links'>
        <NavLink
          to='/'
          end
          className={({ isActive }) =>
            `hero-nav-link ${isActive ? 'selected-nav-link' : ''}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to='/about'
          className={({ isActive }) =>
            `hero-nav-link ${isActive ? 'selected-nav-link' : ''}`
          }
        >
          About
        </NavLink>
      </nav>

      <InvertedFillet type='nav-tr' className='fillet-nav-tr' />
    </header>
  );
}
