import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from './Footer';

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    // Fetch post details
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch post: HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setPost(data.post);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching post:', err);
        setError(err.message);
        setLoading(false);
      });

    // Fetch comments
    fetch(`/api/comments/posts/${id}/comments`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch comments: HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setComments(Array.isArray(data.comments) ? data.comments : []);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching comments:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    setCommentError(null);

    fetch(`/api/comments/posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: commentText.trim() }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to add comment: HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.comment) {
          setComments((prev) => [...prev, data.comment]);
        }
        setAuthorName('');
        setCommentText('');
        setSubmittingComment(false);
      })
      .catch((err) => {
        console.error('Error submitting comment:', err);
        setCommentError(err.message);
        setSubmittingComment(false);
      });
  };

  return (
    <div>
      <p style={{ padding: '16px' }}>
        <Link to='/'>← Back to Home</Link>
      </p>

      {loading && <p style={{ padding: '16px' }}>Loading post...</p>}

      {error && (
        <p style={{ padding: '16px', color: 'red' }}>
          Unable to load post: {error}
        </p>
      )}

      {!loading && !error && post && (
        <div style={{ padding: '16px' }}>
          <h1>{post.title}</h1>
          <p>Author: {post.author || `User #${post.user_id}`}</p>

          {post.image_url && (
            <p>
              <img
                src={post.image_url}
                alt={post.title}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </p>
          )}

          <p>{post.content}</p>

          <hr />

          <h2>Comments</h2>

          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <p key={comment.id}>
                <strong>Comment #{comment.id}:</strong> {comment.content}
              </p>
            ))
          )}

          <hr />

          <form onSubmit={handleAddComment}>
            <p>Add a comment:</p>
            <p>
              <label htmlFor='comment-name'>Name:</label>
              <br />
              <input
                id='comment-name'
                type='text'
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder='Your name...'
              />
            </p>
            <p>
              <label htmlFor='comment-content'>Comment:</label>
              <br />
              <textarea
                id='comment-content'
                rows={3}
                cols={40}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder='Write a comment...'
                required
              />
            </p>
            {commentError && (
              <p style={{ color: 'red' }}>Failed to post comment: {commentError}</p>
            )}
            <p>
              <button type='submit' disabled={submittingComment}>
                {submittingComment ? 'Submitting...' : 'Submit Comment'}
              </button>
            </p>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
