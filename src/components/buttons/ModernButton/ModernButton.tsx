import React from 'react';
import Link from 'next/link';
import './ModernButton.css';

interface ModernButtonProps {
  href?: string;
  children?: React.ReactNode;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  href = '/product/CLI',
  children = 'early access',
}) => {
  return (
    <div className="hero-fade-in modern-button-wrapper">
      <Link href={href} className="modern-button-link">
        <div className="modern-button-container">
          <div className="modern-button-circle">
            <div className="modern-button-pattern">
              <div className="modern-button-pattern-gradient"></div>
            </div>
          </div>
          <div className="modern-button-border">
            <div className="modern-button-border-gradient"></div>
          </div>
          <div className="modern-button-text">{children}</div>
        </div>
      </Link>
    </div>
  );
};
