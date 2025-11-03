'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Settings,
  LogOut
} from 'lucide-react';
import { SITE_CONFIG } from '@/config/constants';
import { ClientThemeToggle } from '@/components/theme';
import { useDashboard } from '../DashboardContext';
import { useAuth } from '@/contexts/AuthContext';
import './DashboardNav.css';

export function DashboardNav() {
  const { isMenuOpen, isMobile, isCollapsed, closeMenu } = useDashboard();
  const { signOut, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

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

  const mainNavLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  ];

  const settingsLinks = [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {isMenuOpen && isMobile && (
        <div className="dashboard-sidebar-overlay" onClick={closeMenu}></div>
      )}
      <aside ref={navRef} className={`dashboard-sidebar ${isMobile && !isMenuOpen ? 'closed' : ''} ${!isMobile && isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-sidebar-content">
          <div className="dashboard-sidebar-header">
            <Link href="/" className="dashboard-sidebar-logo" onClick={closeMenu}>
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
            <div className="dashboard-sidebar-section">
              <div className="dashboard-sidebar-links">
                {mainNavLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={`${link.href}-${link.label}-${index}`}
                      href={link.href}
                      className={`dashboard-sidebar-link ${isActive ? 'active' : ''}`}
                      onClick={closeMenu}
                    >
                      {Icon && <Icon className="dashboard-sidebar-link-icon" />}
                      <span className="dashboard-sidebar-link-text">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="dashboard-sidebar-section">
              <div className="dashboard-sidebar-section-title">Settings</div>
              <div className="dashboard-sidebar-links">
                {settingsLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`dashboard-sidebar-link ${isActive ? 'active' : ''}`}
                      onClick={closeMenu}
                    >
                      {Icon && <Icon className="dashboard-sidebar-link-icon" />}
                      <span className="dashboard-sidebar-link-text">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="dashboard-sidebar-footer">
            {user && (
              <button
                onClick={handleSignOut}
                className="dashboard-sidebar-logout"
                aria-label="Sign out"
                type="button"
              >
                <LogOut className="dashboard-sidebar-logout-icon" />
                <span className="dashboard-sidebar-logout-text">Sign Out</span>
              </button>
            )}
            <div 
              className="dashboard-sidebar-theme-toggle-wrapper"
              onClick={() => {
                const themeToggle = document.querySelector('.theme-toggle') as HTMLButtonElement;
                if (themeToggle) {
                  themeToggle.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Toggle theme"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const themeToggle = document.querySelector('.theme-toggle') as HTMLButtonElement;
                  if (themeToggle) {
                    themeToggle.click();
                  }
                }
              }}
            >
              <ClientThemeToggle />
              <span className="dashboard-sidebar-theme-toggle-label">Theme</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
