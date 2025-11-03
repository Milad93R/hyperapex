'use client';

import React from 'react';
import { PanelLeft, PanelLeftClose } from 'lucide-react';
import { HamburgerMenu } from '@/components/ui/HamburgerMenu';
import { useDashboard } from '../DashboardContext';
import './DashboardHeader.css';

export function DashboardHeader() {
  const { isMobile, isMenuOpen, isCollapsed, toggleMenu, toggleCollapse } = useDashboard();

  return (
    <header className="dashboard-header-bar" data-collapsed={!isMobile && isCollapsed}>
      <div className="dashboard-header-bar-content">
        <div className="dashboard-header-bar-left">
          {isMobile ? (
            <button 
              className="dashboard-header-toggle"
              onClick={toggleMenu}
              aria-label="Toggle sidebar"
              type="button"
            >
              <HamburgerMenu isOpen={isMenuOpen} onClick={toggleMenu} />
            </button>
          ) : (
            <button 
              className="dashboard-header-collapse"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              type="button"
            >
              {isCollapsed ? (
                <PanelLeftClose className="dashboard-header-collapse-icon" />
              ) : (
                <PanelLeft className="dashboard-header-collapse-icon" />
              )}
            </button>
          )}
          <h2 className="dashboard-header-bar-title">Overview</h2>
        </div>
      </div>
    </header>
  );
}

