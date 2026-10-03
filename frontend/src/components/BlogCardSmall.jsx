import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogCardSmall({ post }) {
  return (
    <article className='blog-card-small-wrapper reveal'>
      <Link
        to={`/post/${post.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
      >
        <div className='blog-card-small'>
          <div className='blog-card-small-thumb-wrapper'>
            <img
              src={post.image_url || '/space.png'}
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

      <div className='blog-card-divider' />
    </article>
  );
}
