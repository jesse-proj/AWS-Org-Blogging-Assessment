import React, { useState, useEffect } from 'react';
import BlogCardBig from './BlogCardBig';
import BlogCardSmall from './BlogCardSmall';
import '../styles/BlogSection.css';

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch posts: HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) {
          return;
        }
        let fetchedPosts;
        if (Array.isArray(data.posts)) {
          fetchedPosts = data.posts;
        }
        else {
          fetchedPosts = [];
        }
        const sorted = fetchedPosts.slice().sort((a, b) => b.id - a.id);
        setPosts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        console.error('Error fetching blog posts from backend:', err);
        setError(err.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function reveal() {
      const reveals = document.querySelectorAll('.reveal');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;

        if (elementTop < windowHeight) {
          reveals[i].classList.add('active');
        } 
        else {
          reveals[i].classList.remove('active');
        }
      }
    }

    window.addEventListener('scroll', reveal);
    reveal();

    return () => {
      window.removeEventListener('scroll', reveal);
    };
  }, [posts]);

  if (loading) {
    return (
      <section className='blog-section-card'>
        <div className='blog-section-loading'>
          <p>Loading blog posts...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='blog-section-card'>
        <div className='blog-section-error'>
          <p>Unable to load posts at this time: {error}</p>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className='blog-section-card'>
        <div className='blog-section-empty'>
          <p>No blog posts found.</p>
        </div>
      </section>
    );
  }

  const latestPost = posts[0];
  const otherPostsTop = posts.slice(1, 3);
  const bottomPosts = posts.slice(3);

  return (
    <div id='posts' className='blog-section-card'>
      <div className='blog-section-top'>
        <div className='blog-section-left'>
          <BlogCardBig post={latestPost} />
        </div>

        <div className='blog-section-right'>
          <h4 className='blog-section-heading'>OTHER POSTS</h4>
          <div className='blog-small-list'>
            {otherPostsTop.map((post) => (
              <BlogCardSmall
                key={post.id}
                post={post}
              />
            ))}
          </div>
        </div>
      </div>

      {bottomPosts.length > 0 && (
        <div className='blog-section-bottom'>
          <div className='blog-bottom-list'>
            {bottomPosts.map((post) => (
              <BlogCardSmall
                key={post.id}
                post={post}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
