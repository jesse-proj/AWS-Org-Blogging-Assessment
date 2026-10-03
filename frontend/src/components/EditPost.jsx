import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Hero from './Hero';
import Footer from './Footer';
import PublishNavTabs from './publish/PublishNavTabs';
import PublishAlerts from './publish/PublishAlerts';
import PublishForm from './publish/PublishForm';
import PublishPreview from './publish/PublishPreview';
import { useEditPost } from '../hooks/useEditPost';
import '../styles/PublishPost.css';

export default function EditPost() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('write');

  const {
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
  } = useEditPost(id, location.state?.post);

  const handleSubmit = (e) => {
    e.preventDefault();
    savePost();
  };

  const handleCancel = () => {
    navigate(`/post/${id}`);
  };

  if (loading) {
    return (
      <div className='publish-page'>
        <Hero
          compact
          imageUrl='/single_post_hero.png'
          title='Edit Post'
          subtitle='Loading article details...'
          showBio={false}
          showPublish={false}
          showEdit={false}
          showDelete={false}
        />
        <main className='publish-container publish-loading-container'>
          <p className='publish-loading-text'>Loading post...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (fetchError || !isAuthor) {
    return (
      <div className='publish-page'>
        <Hero
          compact
          imageUrl='/single_post_hero.png'
          title='Edit Post'
          subtitle='Permission or retrieval error'
          showBio={false}
          showPublish={false}
          showEdit={false}
          showDelete={false}
        />
        <main className='publish-container publish-error-container'>
          <div className='publish-alert publish-alert--error'>
            <span>{fetchError || 'You do not have permission to edit this post.'}</span>
          </div>
          <button
            type='button'
            className='publish-btn-secondary'
            onClick={() => navigate(`/post/${id}`)}
          >
            Return to Post
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='publish-page'>
      <Hero
        compact
        imageUrl='/single_post_hero.png'
        title='Edit Post'
        subtitle='Update and preview your story'
        showBio={false}
        showPublish={false}
        showEdit={false}
        showDelete={false}
      />

      <main className='publish-container'>
        <PublishNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <PublishAlerts
          errorMessage={saveError}
          publishSuccess={saveSuccess}
          successMessage='Post updated successfully! Redirecting to post...'
        />

        {activeTab === 'write' ? (
          <PublishForm
            title={title}
            onTitleChange={(val) => {
              setTitle(val);
              if (saveError) setSaveError(null);
            }}
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            content={content}
            onContentChange={(val) => {
              setContent(val);
              if (saveError) setSaveError(null);
            }}
            wordCount={wordCount}
            isPublishing={isSaving}
            publishSuccess={saveSuccess}
            onSubmit={handleSubmit}
            isEdit={true}
            onCancel={handleCancel}
          />
        ) : (
          <PublishPreview previewData={previewPostData} />
        )}
      </main>

      <Footer />
    </div>
  );
}
