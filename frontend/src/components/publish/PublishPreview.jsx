import React from 'react';
import SinglePost from '../SinglePost';

export default function PublishPreview({ previewData }) {
  return (
    <div className='publish-preview-section'>
      <SinglePost
        isPreview={true}
        previewData={previewData}
        showFooter={false}
      />
    </div>
  );
}
