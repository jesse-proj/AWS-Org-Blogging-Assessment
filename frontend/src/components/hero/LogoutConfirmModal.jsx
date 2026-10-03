import React from 'react';
import RetroModal from '../common/RetroModal';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  return (
    <RetroModal
      isOpen={isOpen}
      title='System Alert: Logout'
      menuItem={<><u>S</u>ession</>}
      message='Are you sure you want to log out?'
      subtext='Your current session will end and you will need to sign in again to publish or edit posts.'
      cancelText='Cancel'
      confirmText='Log Out'
      isDanger={true}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
