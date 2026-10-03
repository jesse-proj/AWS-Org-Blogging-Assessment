import React from 'react';
import BlogCardSmall from '../BlogCardSmall';

export default function PostSidebar({ posts = [] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <aside className='single-post-sidebar'>
      <h3 className='single-post-sidebar-heading'>OTHER POSTS</h3>
      <div className='single-post-sidebar-list'>
        {posts.map((post) => (
          <BlogCardSmall
            key={post.id}
            post={post}
            reveal={false}
          />
        ))}
      </div>
    </aside>
  );
}
