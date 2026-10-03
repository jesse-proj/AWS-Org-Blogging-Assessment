import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';

export function usePublish() {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const publishPost = useCallback(
    async ({ title, content, imageUrl }) => {
      if (!title?.trim()) {
        setErrorMessage('Please provide a post title.');
        return false;
      }
      if (!content?.trim()) {
        setErrorMessage('Please provide content for your blog post.');
        return false;
      }

      setErrorMessage(null);
      setIsPublishing(true);

      try {
        const res = await fetchWithAuth('/api/posts/create', {
          method: 'POST',
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            image_url: imageUrl?.trim() || null,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to publish post');
        }

        setIsPublishing(false);
        setPublishSuccess(true);

        setTimeout(() => {
          if (data.post?.id) {
            navigate(`/post/${data.post.id}`);
          } else {
            navigate('/');
          }
        }, 1000);

        return true;
      } catch (err) {
        setIsPublishing(false);
        setErrorMessage(err.message || 'Failed to publish post.');
        return false;
      }
    },
    [navigate]
  );

  return {
    isPublishing,
    publishSuccess,
    errorMessage,
    setErrorMessage,
    publishPost,
  };
}
