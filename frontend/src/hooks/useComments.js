import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';

export function useComments(postId, isPreview = false) {
  const [comments, setComments] = useState([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    if (isPreview || !postId) {
      return;
    }

    let isMounted = true;

    fetch(`/api/comments/posts/${postId}/comments`)
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
  }, [postId, isPreview]);

  const addComment = async (content) => {
    if (!content?.trim() || !postId) return false;

    setSubmittingComment(true);
    setCommentError(null);

    try {
      const res = await fetchWithAuth(`/api/comments/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Failed to add comment: HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.comment) {
        setComments((prev) => [...prev, data.comment]);
      }
      setSubmittingComment(false);
      return true;
    } catch (err) {
      console.error('Error submitting comment:', err);
      setCommentError(err.message);
      setSubmittingComment(false);
      return false;
    }
  };

  const deleteComment = async (commentId) => {
    if (!commentId) return false;
    try {
      const res = await fetchWithAuth(`/api/comments/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete comment: HTTP ${res.status}`);
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      return true;
    } catch (err) {
      console.error('Error deleting comment:', err);
      setCommentError(err.message);
      return false;
    }
  };

  const clearCommentError = () => setCommentError(null);

  return {
    comments,
    submittingComment,
    commentError,
    clearCommentError,
    addComment,
    deleteComment,
  };
}
