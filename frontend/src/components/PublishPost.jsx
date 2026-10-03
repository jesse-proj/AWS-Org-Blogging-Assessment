import React, { useState } from 'react';
import Hero from './Hero';
import Footer from './Footer';
import PublishNavTabs from './publish/PublishNavTabs';
import PublishAlerts from './publish/PublishAlerts';
import PublishForm from './publish/PublishForm';
import PublishPreview from './publish/PublishPreview';
import { useAuth } from '../context/useAuth';
import { usePublishForm } from '../hooks/usePublishForm';
import { usePublish } from '../hooks/usePublish';
import '../styles/PublishPost.css';

export default function PublishPost() {
  const { user } = useAuth();
  const author = user?.username || 'You';
  const [activeTab, setActiveTab] = useState('write');

  const {
    title,
    setTitle,
    content,
    setContent,
    imageUrl,
    setImageUrl,
    wordCount,
    previewPostData,
  } = usePublishForm(author);

  const {
    isPublishing,
    publishSuccess,
    errorMessage,
    setErrorMessage,
    publishPost,
  } = usePublish();

  const handlePublishSubmit = (e) => {
    e.preventDefault();
    publishPost({ title, content, imageUrl });
  };

  return (
    <div className='publish-page'>
      <Hero
        compact
        imageUrl='/single_post_hero.png'
        title='Publish Post'
        subtitle='Compose and preview your story'
        showBio={false}
        showPublish={false}
        showEdit={false}
        showDelete={false}
      />

      <main className='publish-container'>
        <PublishNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <PublishAlerts
          errorMessage={errorMessage}
          publishSuccess={publishSuccess}
        />

        {activeTab === 'write' ? (
          <PublishForm
            title={title}
            onTitleChange={(val) => {
              setTitle(val);
              if (errorMessage) setErrorMessage(null);
            }}
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            content={content}
            onContentChange={(val) => {
              setContent(val);
              if (errorMessage) setErrorMessage(null);
            }}
            wordCount={wordCount}
            isPublishing={isPublishing}
            publishSuccess={publishSuccess}
            onSubmit={handlePublishSubmit}
          />
        ) : (
          <PublishPreview previewData={previewPostData} />
        )}
      </main>

      <Footer />
    </div>
  );
}
