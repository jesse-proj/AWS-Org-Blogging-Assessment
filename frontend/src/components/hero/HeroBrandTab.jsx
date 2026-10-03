import React from 'react';
import InvertedFillet from '../InvertedFillet';

export default function HeroBrandTab({
  title,
  author,
  subtitle,
  compact = false,
}) {
  return (
    <div className={`hero-tab hero-tab-brand ${compact ? 'hero-tab-brand--compact' : ''}`}>
      <h1 className={`hero-brand-title ${compact ? 'hero-brand-title--compact' : ''}`}>
        {title}
      </h1>

      {compact ? (
        author ? (
          <p className='hero-brand-subtitle'>
            By <span className='hero-brand-author-name'>{author}</span>
          </p>
        ) : subtitle ? (
          <p className='hero-brand-subtitle'>{subtitle}</p>
        ) : null
      ) : subtitle ? (
        <p className='hero-brand-subtitle'>{subtitle}</p>
      ) : (
        <p className='hero-brand-subtitle'>
          All my blog posts are super duper cool and amazing. Read them all!
        </p>
      )}

      <InvertedFillet type='brand-br' className='fillet-brand-br' />
    </div>
  );
}
