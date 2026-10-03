import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function PublishAlerts({
  errorMessage,
  publishSuccess,
  successMessage = 'Post published successfully! Redirecting to home...',
}) {
  if (!errorMessage && !publishSuccess) return null;

  return (
    <>
      {errorMessage && (
        <div className='publish-alert publish-alert--error'>
          <FontAwesomeIcon icon={faCircleExclamation} />
          <span>{errorMessage}</span>
        </div>
      )}

      {publishSuccess && (
        <div className='publish-alert publish-alert--success'>
          <FontAwesomeIcon icon={faCheck} />
          <span>{successMessage}</span>
        </div>
      )}
    </>
  );
}
