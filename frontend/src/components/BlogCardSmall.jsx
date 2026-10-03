import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogCardSmall({ post, reveal = true }) {
  return (
    <article className={`blog-card-small-wrapper ${reveal ? 'reveal' : ''}`}>
      <Link to={`/post/${post.id}`} className='blog-card-link'>
        <div className='blog-card-small'>
          <div className='blog-card-small-thumb-wrapper'>
            <img
              src={post.image_url || '/home_hero.png'}
              alt={post.title}
              className='blog-card-small-thumb'
            />
          </div>

          <div className='blog-card-small-content'>
            <h4 className='blog-card-small-title'>{post.title}</h4>
            <p className='blog-card-small-text'>{post.content}</p>
          </div>
        </div>
      </Link>

      <hr className='blog-card-divider' />
    </article>
  );
}
