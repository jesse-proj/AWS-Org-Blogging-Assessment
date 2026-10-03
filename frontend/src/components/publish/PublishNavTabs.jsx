import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEye } from '@fortawesome/free-solid-svg-icons';

export default function PublishNavTabs({ activeTab, onTabChange }) {
  return (
    <div className='publish-mode-nav'>
      <div className='publish-tabs' role='tablist'>
        <button
          type='button'
          role='tab'
          aria-selected={activeTab === 'write'}
          className={`publish-tab-btn ${activeTab === 'write' ? 'active' : ''}`}
          onClick={() => onTabChange('write')}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
          <span>Write</span>
        </button>
        <button
          type='button'
          role='tab'
          aria-selected={activeTab === 'preview'}
          className={`publish-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => onTabChange('preview')}
        >
          <FontAwesomeIcon icon={faEye} />
          <span>Live Preview</span>
        </button>
      </div>
    </div>
  );
}
