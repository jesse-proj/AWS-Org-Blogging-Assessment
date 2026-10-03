import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Hero from './Hero';
import Footer from './Footer';
import PostArticle from './post/PostArticle';
import PostComments from './post/PostComments';
import PostSidebar from './post/PostSidebar';
import PostStatus from './post/PostStatus';
import DeletePostModal from './post/DeletePostModal';
import { usePost } from '../hooks/usePost';
import { useComments } from '../hooks/useComments';
import { useRelatedPosts } from '../hooks/useRelatedPosts';
import '../styles/SinglePost.css';

export default function SinglePost({
  isPreview = false,
  previewData = null,
  showFooter = true,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    post,
    loading,
    error,
    isAuthor,
    authorNameDisplay,
    isDeleting,
    deleteError,
    clearDeleteError,
    deletePost,
  } = usePost(id, isPreview, previewData);

  const { comments, submittingComment, commentError, addComment, deleteComment } = useComments(
    id,
    isPreview
  );

  const { relatedPosts } = useRelatedPosts(id);

  const handleStartEdit = () => {
    navigate(`/edit/${id}`, { state: { post } });
  };

  const handleDeleteClick = () => {
    clearDeleteError();
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    clearDeleteError();
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    const success = await deletePost();
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className='single-post-page'>
      <Hero
        compact
        imageUrl='/home_hero.png'
        title={post?.title || (loading ? 'Loading...' : 'Blog Post')}
        author={authorNameDisplay}
        showBio={false}
        showPublish={false}
        showEdit={!isPreview && Boolean(post) && isAuthor}
        showDelete={!isPreview && Boolean(post) && isAuthor}
        onEdit={!isPreview && isAuthor ? handleStartEdit : undefined}
        onDelete={!isPreview && isAuthor ? handleDeleteClick : undefined}
      />

      <DeletePostModal
        isOpen={showDeleteConfirm}
        postTitle={post?.title}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />

      <div className='single-post-container'>
        <PostStatus loading={loading} error={error} />

        {!loading && !error && post && (
          <div className='single-post-grid'>
            <div className='single-post-main-content'>
              <PostArticle post={post} />
              <PostComments
                comments={comments}
                isPreview={isPreview}
                onAddComment={addComment}
                onDeleteComment={deleteComment}
                submitting={submittingComment}
                error={commentError}
              />
            </div>

            <PostSidebar posts={relatedPosts} />
          </div>
        )}
      </div>

      {showFooter && <Footer />}
    </div>
  );
}
