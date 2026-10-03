import React from 'react';

const configs = {
  'nav-tr': [32, 'M 0 0 H 32 A 32 32 0 0 0 0 32 Z'],
  'auth-tl': [32, 'M 32 0 H 0 A 32 32 0 0 1 32 32 Z'],
  'brand-br': [36, 'M 0 36 H 36 A 36 36 0 0 1 0 0 Z'],
  'publish-bl': [32, 'M 32 32 H 0 A 32 32 0 0 0 32 0 Z'],
};

export default function InvertedFillet({ type, className = '' }) {
  const config = configs[type] || [32, ''];
  const [size, path] = config;

  return (
    <svg
      className={`hero-fillet ${className}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='var(--primary-bg)'
    >
      <path d={path} />
    </svg>
  );
}
