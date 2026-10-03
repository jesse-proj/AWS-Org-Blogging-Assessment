import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/useAuth';

export default function PostComments({
  comments = [],
  isPreview = false,
  onAddComment,
  onDeleteComment,
  submitting = false,
  error = null,
}) {
  const { isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const success = await onAddComment(commentText.trim());
    if (success) {
      setCommentText('');
    }
  };

  return (
    <section className='single-post-comments-section'>
      {isPreview ? (
        <div className='single-post-form-card single-post-comments-preview-banner'>
          <h3 className='single-post-heading single-post-comments-preview-heading'>
            COMMENTS PREVIEW
          </h3>
          <p className='single-post-comments-preview-text'>
            Interactive comment submission is disabled in preview mode.
          </p>
        </div>
      ) : isAuthenticated ? (
        <div className='single-post-form-card'>
          <h3 className='single-post-heading single-post-form-heading'>
            LEAVE A COMMENT
          </h3>

          <form onSubmit={handleSubmit}>
            <div className='single-post-form-group'>
              <label htmlFor='comment-content' className='single-post-label'>
                Comment
              </label>
              <textarea
                id='comment-content'
                rows={4}
                className='single-post-textarea'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder='Write your comment here...'
                required
              />
            </div>

            {error && (
              <div className='single-post-form-error'>
                Failed to post comment: {error}
              </div>
            )}

            <button
              type='submit'
              className='btn-primary btn-full'
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      ) : null}

      <div className='single-post-comments-list-wrapper'>
        <h2 className='single-post-heading'>
          COMMENTS ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <div className='single-post-comment-empty'>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className='single-post-comment-card'>
              <div className='single-post-comment-header'>
                <div className='single-post-comment-user'>
                  <span className='single-post-comment-name'>
                    Reader
                  </span>
                </div>
                {!isPreview && isAuthenticated && onDeleteComment && (
                  <button
                    type='button'
                    className='single-post-comment-delete-btn'
                    onClick={() => onDeleteComment(comment.id)}
                    title='Delete Comment'
                    aria-label='Delete Comment'
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
              <p className='single-post-comment-text'>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
