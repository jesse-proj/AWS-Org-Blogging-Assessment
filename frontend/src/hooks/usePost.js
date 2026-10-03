import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { fetchWithAuth } from '../utils/api';

export function usePost(id, isPreview = false, previewData = null) {
  const { user, isAuthenticated } = useAuth();
  const [fetchedPost, setFetchedPost] = useState(null);
  const [loading, setLoading] = useState(!isPreview);
  const [error, setError] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const post = isPreview ? previewData : fetchedPost;

  useEffect(() => {
    if (isPreview || !id) {
      return;
    }

    window.scrollTo(0, 0);
    let isMounted = true;

    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch post: HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setFetchedPost(data.post);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching post:', err);
        setError(err.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, isPreview]);

  const authorNameDisplay =
    post?.author || (post?.user_id ? `User #${post.user_id}` : '');

  const isAuthor = Boolean(
    isAuthenticated &&
      user &&
      post &&
      (Number(user.id) === Number(post.user_id) || user.username === post.author)
  );

  const deletePost = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetchWithAuth(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete post: HTTP ${res.status}`);
      }

      setIsDeleting(false);
      return true;
    } catch (err) {
      console.error('Error deleting post:', err);
      setDeleteError(err.message);
      setIsDeleting(false);
      return false;
    }
  };

  const clearDeleteError = () => setDeleteError(null);

  return {
    post,
    loading,
    error,
    isAuthor,
    authorNameDisplay,
    isDeleting,
    deleteError,
    clearDeleteError,
    deletePost,
  };
}
