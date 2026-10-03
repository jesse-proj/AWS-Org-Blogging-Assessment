import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/BioWindow.css';

export default function BioWindow() {
  const [scrollY,   setScrollY]     = useState(0);
  const [showAlert, setShowAlert]   = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener(
      'scroll',
      handleScroll,
      {passive: true}
    );

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const translateY = Math.max(0, scrollY * 0.45);
  const opacity = Math.max(0, Math.min(1, 1 - scrollY / 380));
  let pointerEvents;
  if (opacity <= 0.05) {
    pointerEvents = 'none';
  }
  else {
    pointerEvents = 'auto';
  }

  const scrollEffectStyle = {
    transform: `translateY(${translateY}px)`,
    opacity,
    pointerEvents,
  };

  const handleClose = () => {
    setShowAlert(true);
  };

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className='bio-window' style={scrollEffectStyle}>
      <div className='bio-window-titlebar'>
        <span className='bio-window-title'>Jesse's Bio</span>
        <button
          type='button'
          className='bio-window-close-btn'
          onClick={handleClose}
          title='Close'>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <div className='bio-window-menubar'>
        <span className='bio-window-menu-item'>
          <u>A</u>bout
        </span>
      </div>

      <div className='bio-window-body'>
        <div className='bio-media-slot'>
          <img src='/profile.png' alt="Jesse's Bio" className='bio-image' />
        </div>

        <div className='bio-info-column'>
          <div className='bio-meta-box'>
            <span className='bio-meta-text'>File: profile.png</span>
          </div>

          <div className='bio-meta-box'>
            <span className='bio-meta-text'>Location: assets/profile.png</span>
          </div>

          <div className='bio-dead-space-zone' />

          <p className='bio-description'>
            Web Developer, Game Developer, and Information Technology Student
          </p>
        </div>
      </div>

      {showAlert && (
        <div className='retro-alert-window'>
          <div className='retro-alert-titlebar'>
            <span id='alert-title' className='retro-alert-title'>System Alert</span>
            <button
              type='button'
              className='bio-window-close-btn'
              onClick={handleDismissAlert}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className='retro-alert-body'>
            <div className='retro-alert-content'>
              <span className='retro-alert-message'>You can't do that! :P</span>
            </div>

            <div className='retro-alert-actions'>
              <button
                type='button'
                className='retro-alert-btn'
                onClick={handleDismissAlert}
                autoFocus>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
