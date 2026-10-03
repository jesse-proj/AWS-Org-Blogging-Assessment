import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InvertedFillet from '../InvertedFillet';
import LogoutConfirmModal from './LogoutConfirmModal';
import { useAuth } from '../../context/useAuth';

export default function HeroAuthTab() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <div className='hero-tab hero-tab-auth'>
        <InvertedFillet type='auth-tl' className='fillet-auth-tl' />
        <nav className='hero-nav-links'>
          {isLoading ? null : isAuthenticated ? (
            <button
              type='button'
              onClick={() => setShowLogoutConfirm(true)}
              className='hero-nav-link hero-user-btn'
              title='Account / Log Out'
            >
              @{user?.username}
            </button>
          ) : (
            <Link to='/login' className='hero-nav-link'>
              Login
            </Link>
          )}
        </nav>
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
      />
    </>
  );
}
