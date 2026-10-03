import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import InvertedFillet from '../InvertedFillet';
import { useAuth } from '../../context/useAuth';

export default function HeroActionsTab({
  showPublish = false,
  showEdit = false,
  showDelete = false,
  onEdit,
  onDelete,
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || (!showPublish && !showEdit && !showDelete)) {
    return null;
  }

  return (
    <div className='hero-tab hero-tab-publish'>
      <InvertedFillet type='publish-bl' className='fillet-publish-bl' />
      <div className='hero-publish-actions'>
        {showPublish && (
          <Link
            to='/publish'
            className='hero-publish-btn'
            title='Publish Post'
            aria-label='Publish Post'
          >
            <FontAwesomeIcon icon={faPenToSquare} className='hero-publish-icon' />
            <span className='hero-publish-text'>Publish</span>
          </Link>
        )}
        {showEdit && (
          <button
            type='button'
            onClick={onEdit}
            className='hero-publish-btn'
            title='Edit Post'
            aria-label='Edit Post'
          >
            <FontAwesomeIcon icon={faPencil} className='hero-publish-icon' />
            <span className='hero-publish-text'>Edit</span>
          </button>
        )}
        {showDelete && (
          <button
            type='button'
            onClick={onDelete}
            className='hero-publish-btn hero-publish-btn--delete'
            title='Delete Post'
            aria-label='Delete Post'
          >
            <FontAwesomeIcon icon={faTrash} className='hero-publish-icon' />
            <span className='hero-publish-text'>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}
