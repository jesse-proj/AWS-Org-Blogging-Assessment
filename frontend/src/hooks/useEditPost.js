import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { fetchWithAuth } from '../utils/api';

export function useEditPost(id, initialData = null) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(initialData);
  const [loading, setLoading] = useState(!initialData && Boolean(id));
  const [fetchError, setFetchError] = useState(null);

  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (initialData || !id) return;

    let isMounted = true;

    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load post (HTTP ${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setPost(data.post);
        setTitle(data.post?.title || '');
        setContent(data.post?.content || '');
        setImageUrl(data.post?.image_url || '');
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setFetchError(err.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, initialData]);

  // Authorization check
  const isAuthor = useMemo(() => {
    if (!post || !user || !isAuthenticated) return false;
    return Number(user.id) === Number(post.user_id) || user.username === post.author;
  }, [post, user, isAuthenticated]);

  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [content]);

  const previewPostData = useMemo(() => ({
    id: post?.id || Number(id) || 9999,
    title: title.trim() || 'Untitled Blog Post',
    content: content.trim() || 'Start editing your post to see the preview...',
    author: post?.author || user?.username || 'You',
    image_url: imageUrl.trim() || undefined,
  }), [post, id, title, content, user, imageUrl]);

  const savePost = useCallback(async () => {
    if (!title.trim()) {
      setSaveError('Please provide a post title.');
      return false;
    }
    if (!content.trim()) {
      setSaveError('Please provide content for your post.');
      return false;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetchWithAuth(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          image_url: imageUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update post.');
      }

      setIsSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        navigate(`/post/${id}`);
      }, 900);

      return true;
    } catch (err) {
      setIsSaving(false);
      setSaveError(err.message || 'Failed to update post.');
      return false;
    }
  }, [id, title, content, imageUrl, navigate]);

  return {
    post,
    loading,
    fetchError,
    isAuthor,
    title,
    setTitle,
    content,
    setContent,
    imageUrl,
    setImageUrl,
    wordCount,
    previewPostData,
    isSaving,
    saveSuccess,
    saveError,
    setSaveError,
    savePost,
  };
}
