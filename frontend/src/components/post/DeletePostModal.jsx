import React from 'react';
import RetroModal from '../common/RetroModal';

export default function DeletePostModal({
  isOpen,
  postTitle,
  onClose,
  onConfirm,
  isDeleting = false,
  error = null,
}) {
  return (
    <RetroModal
      isOpen={isOpen}
      title='System Alert: Delete Post'
      message={<>Are you sure you want to delete <strong>"{postTitle}"</strong>?</>}
      subtext='This action cannot be undone. All comments will be permanently erased.'
      error={error}
      cancelText='Cancel'
      confirmText='Delete'
      loadingText='Deleting...'
      isLoading={isDeleting}
      isDanger={true}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
