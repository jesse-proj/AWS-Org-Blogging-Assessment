import { useState, useMemo } from 'react';

export function usePublishForm(author = 'You') {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [content]);

  const previewPostData = useMemo(() => ({
    id: 9999,
    title: title.trim(),
    content: content.trim(),
    author,
    image_url: imageUrl.trim()
  }), [title, content, author, imageUrl]);

  return {
    title,
    setTitle,
    content,
    setContent,
    imageUrl,
    setImageUrl,
    wordCount,
    previewPostData,
  };
}
