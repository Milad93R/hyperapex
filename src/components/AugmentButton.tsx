import React from 'react';

interface AugmentButtonProps {
  href?: string;
  children?: React.ReactNode;
}

export const AugmentButton: React.FC<AugmentButtonProps> = ({
  href = '/product/CLI',
  children = 'Augment CLI - Auggie is now available! →',
}) => {
  return (
    <div className="hero-fade-in augment-button-wrapper">
      <a href={href} className="augment-button-link">
        <div className="augment-button-container">
          <div className="augment-button-circle">
            <div className="augment-button-pattern">
              <div className="augment-button-pattern-gradient"></div>
            </div>
          </div>
          <div className="augment-button-border">
            <div className="augment-button-border-gradient"></div>
          </div>
          <div className="augment-button-text">{children}</div>
        </div>
      </a>
    </div>
  );
};

export default AugmentButton;
