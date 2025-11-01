'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NAV_LINKS, SITE_CONFIG } from '@/config/constants';
import { ClientThemeToggle } from '@/components/theme';
import { HamburgerMenu } from '@/components/ui/HamburgerMenu';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const headerActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close menu when resizing to desktop
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && isMobile) {
        const target = event.target as HTMLElement;
        
        // Check if click is outside navigation drawer and header actions
        if (
          navRef.current &&
          !navRef.current.contains(target) &&
          headerActionsRef.current &&
          !headerActionsRef.current.contains(target)
        ) {
          closeMenu();
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Also prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isMobile]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">{SITE_CONFIG.name}</span>
        </div>
        {isMobile ? (
          <>
            <div ref={headerActionsRef} className="mobile-header-actions">
              <ClientThemeToggle />
              <HamburgerMenu isOpen={isMenuOpen} onClick={toggleMenu} />
            </div>
            <nav ref={navRef} className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
              <div className="mobile-nav-content">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="mobile-nav-link"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
            {isMenuOpen && (
              <div className="mobile-nav-overlay" onClick={closeMenu}></div>
            )}
          </>
        ) : (
          <nav className="nav">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
            <ClientThemeToggle />
          </nav>
        )}
      </div>
    </header>
  );
}
