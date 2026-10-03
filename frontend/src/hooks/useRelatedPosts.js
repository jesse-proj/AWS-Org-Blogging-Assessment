import { useState, useEffect } from 'react';

export function useRelatedPosts(currentPostId) {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

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
        if (!isMounted) return;
        const posts = Array.isArray(data.posts) ? data.posts : [];
        const currentIdNum = Number(currentPostId);

        const priorPosts = posts
          .filter((p) => Number(p.id) < currentIdNum)
          .sort((a, b) => Number(b.id) - Number(a.id));

        let sidebar = priorPosts.slice(0, 3);
        if (sidebar.length < 3) {
          const fallbackPosts = posts
            .filter(
              (p) =>
                Number(p.id) !== currentIdNum &&
                !sidebar.some((sp) => sp.id === p.id)
            )
            .sort((a, b) => Number(b.id) - Number(a.id));
          sidebar = [...sidebar, ...fallbackPosts].slice(0, 3);
        }

        setRelatedPosts(sidebar);
        setLoadingRelated(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching all posts for sidebar:', err);
        setLoadingRelated(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPostId]);

  return {
    relatedPosts,
    loadingRelated,
  };
}
