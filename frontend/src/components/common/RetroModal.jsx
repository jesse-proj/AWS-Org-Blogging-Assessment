import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../../styles/RetroModal.css';

export default function RetroModal({
  isOpen,
  title = 'System Alert',
  icon = faTriangleExclamation,
  menuItem,
  message,
  subtext,
  error = null,
  cancelText = 'Cancel',
  confirmText = 'OK',
  isDanger = false,
  isLoading = false,
  loadingText,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className='retro-modal-overlay' onClick={isLoading ? undefined : onClose}>
      <div
        className='retro-modal-dialog'
        onClick={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-label={typeof title === 'string' ? title : undefined}
      >
        <div className='retro-modal-titlebar'>
          <span className='retro-modal-title'>
            {icon && <FontAwesomeIcon icon={icon} />}
            {title}
          </span>
          <button
            type='button'
            className='retro-modal-close-btn'
            onClick={onClose}
            title='Close'
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {menuItem && (
          <div className='retro-modal-menubar'>
            <span className='retro-modal-menu-item'>
              {menuItem}
            </span>
          </div>
        )}

        <div className='retro-modal-body'>
          <div className='retro-modal-content'>
            <div className='retro-modal-message'>
              {message}
            </div>
            {subtext && <p className='retro-modal-subtext'>{subtext}</p>}
          </div>

          {error && (
            <div className='retro-modal-error'>
              Error: {error}
            </div>
          )}

          <div className='retro-modal-actions'>
            {cancelText && (
              <button
                type='button'
                className='retro-modal-btn'
                onClick={onClose}
                disabled={isLoading}
                autoFocus
              >
                {cancelText}
              </button>
            )}
            {confirmText && (
              <button
                type='button'
                className={`retro-modal-btn ${isDanger ? 'retro-modal-btn--danger' : ''}`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading && loadingText ? loadingText : confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
