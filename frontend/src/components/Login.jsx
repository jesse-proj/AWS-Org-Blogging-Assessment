import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/useAuth';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setError(null);
    setSubmitting(true);

    try {
      await login(username.trim(), password);
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-hero-pane'>
          <div className='login-hero-visual'>
            <img
              src='/single_post_hero.png'
              alt='Atmospheric landscape hero'
              className='login-hero-img'
            />
            <div className='login-hero-gradient-overlay' />
            <div className='login-hero-caption'>
              <h2 className='login-hero-heading'>Jesse's Blog</h2>
              <p className='login-hero-subtext'>
                A place for my thoughts on the internet.
              </p>
            </div>
          </div>
        </div>

        <div className='login-form-pane'>
          <div className='login-form-card'>
            <Link to='/' className='login-back-btn'>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to Home</span>
            </Link>

            <div className='login-form-header'>
              <h1 className='login-form-title'>SIGN IN</h1>
              <div className='login-title-bar' />
              <p className='login-form-subtitle'>
                Enter your credentials to access your account.
              </p>
            </div>

            {error && (
              <div className='login-error-banner'>
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className='login-form'>
              <div className='login-group'>
                <label className='login-label' htmlFor='login-username'>
                  Username
                </label>
                <div className='login-input-box'>
                  <FontAwesomeIcon icon={faUser} className='login-input-icon' />
                  <input
                    id='login-username'
                    type='text'
                    className='login-input'
                    placeholder='e.g. jesse_admin'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className='login-group'>
                <label className='login-label' htmlFor='login-password'>
                  Password
                </label>
                <div className='login-input-box'>
                  <FontAwesomeIcon icon={faLock} className='login-input-icon' />
                  <input
                    id='login-password'
                    type={showPassword ? 'text' : 'password'}
                    className='login-input'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type='button'
                    className='login-toggle-pw'
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <button
                type='submit'
                className='btn-primary login-submit-btn'
                disabled={submitting}
              >
                {submitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
