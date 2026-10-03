import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function PublishForm({
  title,
  onTitleChange,
  imageUrl,
  onImageUrlChange,
  content,
  onContentChange,
  wordCount,
  isPublishing,
  publishSuccess,
  onSubmit,
  isEdit = false,
  onCancel,
}) {
  const [failedImageUrl, setFailedImageUrl] = useState(null);
  const isImageValid = Boolean(imageUrl) && failedImageUrl !== imageUrl;

  return (
    <section className='publish-card'>
      <form onSubmit={onSubmit} className='publish-form'>
        <div className='publish-field-group'>
          <div className='publish-field-header'>
            <label htmlFor='publish-title' className='publish-label'>
              Title *
            </label>
            <span className='publish-char-count'>
              {title.length} characters
            </span>
          </div>
          <input
            id='publish-title'
            type='text'
            className='publish-input publish-input--title'
            placeholder='Title...'
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
        </div>

        <div className='publish-field-group'>
          <div className='publish-field-header'>
            <label htmlFor='publish-image-url' className='publish-label'>
              Cover Image URL (Optional)
            </label>
            {imageUrl && (
              <button
                type='button'
                className='publish-preset-btn'
                onClick={() => onImageUrlChange('')}
              >
                Clear Image
              </button>
            )}
          </div>
          <input
            id='publish-image-url'
            type='url'
            className='publish-input'
            placeholder='Image URL'
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
          />

          {isImageValid && (
            <div className='publish-image-preview-card'>
              <img
                src={imageUrl}
                alt='Cover Preview'
                onError={() => setFailedImageUrl(imageUrl)}
              />
              <button
                type='button'
                className='publish-image-remove-btn'
                onClick={() => onImageUrlChange('')}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className='publish-field-group'>
          <div className='publish-field-header'>
            <label htmlFor='publish-content' className='publish-label'>
              Article Content *
            </label>
            <span className='publish-char-count'>
              {wordCount} words
            </span>
          </div>
          <textarea
            id='publish-content'
            className='publish-textarea'
            placeholder='Blog content..'
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            required
          />
        </div>

        <div className='publish-actions-right'>
          {isEdit && onCancel && (
            <button
              type='button'
              className='publish-btn-secondary'
              onClick={onCancel}
              disabled={isPublishing || publishSuccess}
            >
              Cancel
            </button>
          )}
          <button
            type='submit'
            className='btn-primary publish-btn-primary'
            disabled={isPublishing || publishSuccess}
          >
            <FontAwesomeIcon
              icon={isEdit ? faFloppyDisk : faPaperPlane}
            />
            {isPublishing
              ? (isEdit ? 'Saving...' : 'Publishing...')
              : (isEdit ? 'Save Changes' : 'Publish Post')}
          </button>
        </div>
      </form>
    </section>
  );
}
