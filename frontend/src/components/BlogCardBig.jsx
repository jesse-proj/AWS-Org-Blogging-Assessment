import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogCardBig({ post }) {
  return (
    <article className='blog-card-big reveal'>
      <Link to={`/post/${post.id}`} className='blog-card-link'>
        <div className='blog-card-big-inner'>
          <div className='blog-card-big-image-wrapper'>
            <img
              src={post.image_url || '/home_hero.png'}
              alt={post.title}
              className='blog-card-big-image'
            />
          </div>

          <div className='blog-card-big-content'>
            <h2 className='blog-section-heading'>LATEST POST</h2>
            <h3 className='blog-card-big-title'>{post.title}</h3>
            <p className='blog-card-big-text'>{post.content}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
