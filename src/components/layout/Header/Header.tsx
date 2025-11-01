import React from 'react';
import { NAV_LINKS, SITE_CONFIG } from '@/config/constants';
import { ClientThemeToggle } from '@/components/theme';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">{SITE_CONFIG.name}</span>
        </div>
        <nav className="nav">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <ClientThemeToggle />
        </nav>
      </div>
    </header>
  );
}
