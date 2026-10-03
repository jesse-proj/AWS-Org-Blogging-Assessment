import React from 'react';
import BioWindow from './BioWindow';
import HeroNavTab from './hero/HeroNavTab';
import HeroAuthTab from './hero/HeroAuthTab';
import HeroBrandTab from './hero/HeroBrandTab';
import HeroActionsTab from './hero/HeroActionsTab';
import '../styles/BioWindow.css';
import '../styles/Hero.css';

export default function Hero({
  compact = false,
  imageUrl,
  title,
  author,
  subtitle,
  showBio = true,
  showPublish = !compact,
  showEdit = false,
  showDelete = false,
  onEdit,
  onDelete,
}) {
  const heroStyle = imageUrl
    ? { backgroundImage: `url(${imageUrl})` }
    : undefined;

  return (
    <div>
      <div
        id='home'
        className={`hero-card ${compact ? 'hero-card--compact' : ''}`}
        style={heroStyle}>
        <HeroNavTab />
        <HeroAuthTab />
        <HeroBrandTab
          title={title}
          author={author}
          subtitle={subtitle}
          compact={compact}/>
        <HeroActionsTab
          showPublish={showPublish}
          showEdit={showEdit}
          showDelete={showDelete}
          onEdit={onEdit}
          onDelete={onDelete}/>

        {showBio && (
          <div className='bio-window-container'>
            <BioWindow />
          </div>
        )}
      </div>
    </div>
  );
}
