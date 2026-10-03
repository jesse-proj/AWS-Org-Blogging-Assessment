import React from 'react';
import { Link } from 'react-router-dom';

export default function PostStatus({ loading = false, error = null }) {
  if (loading) {
    return (
      <div className='single-post-status'>
        <h2 className='single-post-status-title'>Loading Article</h2>
        <p className='single-post-status-text'>Fetching post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='single-post-status'>
        <h2 className='single-post-status-title'>Post Not Found</h2>
        <p className='single-post-status-text'>Unable to load post: {error}</p>
        <Link to='/' className='btn-primary'>
          ← Return to Home
        </Link>
      </div>
    );
  }

  return null;
}
