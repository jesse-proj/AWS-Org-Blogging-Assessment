import React from 'react';

export default function PostArticle({ post }) {
  if (!post) return null;

  return (
    <article className='single-post-article'>
      {post.image_url && (
        <div className='single-post-featured-image-wrapper'>
          <img
            src={post.image_url}
            alt={post.title}
            className='single-post-featured-image'
          />
        </div>
      )}

      <div className='single-post-body'>
        {(post.content || '').split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
