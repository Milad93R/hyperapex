'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { SITE_CONFIG } from '@/config/constants';
import { ClientThemeToggle } from '@/components/theme';
import { useDashboard } from '../DashboardContext';
import './DashboardNav.css';

export function DashboardNav() {
  const { isMenuOpen, isMobile, isCollapsed, closeMenu } = useDashboard();
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && isMobile) {
        const target = event.target as HTMLElement;
        
        if (
          navRef.current &&
          !navRef.current.contains(target) &&
          !(target as HTMLElement).closest('.dashboard-header-toggle')
        ) {
          closeMenu();
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isMobile, closeMenu]);

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  ];

  return (
    <>
      {isMenuOpen && isMobile && (
        <div className="dashboard-sidebar-overlay" onClick={closeMenu}></div>
      )}
      <aside ref={navRef} className={`dashboard-sidebar ${isMobile && !isMenuOpen ? 'closed' : ''} ${!isMobile && isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-sidebar-content">
          <div className="dashboard-sidebar-header">
            <Link href="/dashboard" className="dashboard-sidebar-logo" onClick={closeMenu}>
              <span className="dashboard-sidebar-logo-text">{SITE_CONFIG.name}</span>
            </Link>
            {isMobile && (
              <button 
                className="dashboard-sidebar-close"
                onClick={closeMenu}
                aria-label="Close sidebar"
                type="button"
              >
                <span className="dashboard-sidebar-close-icon"></span>
              </button>
            )}
          </div>
          
          <nav className="dashboard-sidebar-nav">
            <div className="dashboard-sidebar-links">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="dashboard-sidebar-link"
                    onClick={closeMenu}
                  >
                    {Icon && <Icon className="dashboard-sidebar-link-icon" />}
                    <span className="dashboard-sidebar-link-text">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="dashboard-sidebar-footer">
            <ClientThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}

