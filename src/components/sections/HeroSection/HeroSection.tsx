'use client';

import React, { useState } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { HERO_CONTENT, TYPEWRITER_CONFIG } from '@/config/constants';
import { ModernButton } from '@/components/buttons';
import { Header } from '@/components/layout';

export function HeroSection() {
  const [showSubtext, setShowSubtext] = useState(false);

  const { displayedText: displayedHeading } = useTypewriter({
    text: HERO_CONTENT.heading,
    speed: TYPEWRITER_CONFIG.headingSpeed,
    onComplete: () => {
      setTimeout(() => setShowSubtext(true), TYPEWRITER_CONFIG.subheadingDelay);
    },
  });

  const { displayedText: displayedSubheading } = useTypewriter({
    text: showSubtext ? HERO_CONTENT.subheading : '',
    speed: TYPEWRITER_CONFIG.subheadingSpeed,
  });

  return (
    <section className="hero">
      <Header />
      <div className="hero-container">
        <h1 className="hero-heading">
          {displayedHeading}
          {!showSubtext && <span className="typewriter-cursor">|</span>}
        </h1>
        <p className="hero-subheading">
          {displayedSubheading}
          {showSubtext && <span className="typewriter-cursor">|</span>}
        </p>
        <div className="hero-buttons">
          <ModernButton />
          <button className="btn-secondary">Learn More</button>
        </div>
      </div>
    </section>
  );
}
