import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className='footer-container'>
      <div className='footer-content'>
        <div className='footer-brand'>
          <h2 className='footer-title'>Jesse Santiago</h2>
          <p className='footer-description'>
            I try to have fun and make cool stuff so I built this, my own little cozy place on the internet.
          </p>
          <p className='footer-copyright'>
            &copy; 2025. All Rights Reserved by Jesse Santiago
          </p>
        </div>

        <div className='footer-sitemap'>
          <h3 className='footer-column-heading'>Sitemap</h3>
          <div className='footer-sitemap-columns'>
            <ul className='footer-links-list'>
              <li className='footer-link-item'>
                <a href='#home' className='footer-link'>Home</a>
              </li>
              <li className='footer-link-item'>
                <a href='#posts' className='footer-link'>Blog Posts</a>
              </li>
              <li className='footer-link-item'>
                <a href='#about' className='footer-link'>About</a>
              </li>
            </ul>

            <ul className='footer-links-list'>
              <li className='footer-link-item'>
                <a href='#login' className='footer-link'>Login</a>
              </li>
              <li className='footer-link-item'>
                <a href='#create-post' className='footer-link'>Create Post</a>
              </li>
              <li className='footer-link-item'>
                <a href='#register' className='footer-link'>Register</a>
              </li>
            </ul>
          </div>
        </div>

        <div className='footer-contact'>
          <h3 className='footer-column-heading'>Contact me Here</h3>
          <ul className='footer-contact-list'>
            <li className='footer-contact-item'>
              <a
                href='mailto:jian.santiago39@gmail.com'
                className='footer-contact-link'
              >
                <span className='footer-icon'>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <span>jian.santiago39@gmail.com</span>
              </a>
            </li>

            <li className='footer-contact-item'>
              <a
                href='https://x.com/fafefifofuff'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-contact-link'
              >
                <span className='footer-icon'>
                  <FontAwesomeIcon icon={faXTwitter} />
                </span>
                <span>@fafefifofuff</span>
              </a>
            </li>

            <li className='footer-contact-item'>
              <a
                href='https://github.com/jesse-proj'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-contact-link'
              >
                <span className='footer-icon'>
                  <FontAwesomeIcon icon={faGithub} />
                </span>
                <span>@jesse-proj</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
