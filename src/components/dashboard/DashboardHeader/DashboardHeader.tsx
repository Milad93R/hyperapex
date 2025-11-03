'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PanelLeft, PanelLeftClose, Menu, MessageSquare, Bell, HelpCircle, User } from 'lucide-react';
import { useDashboard } from '../DashboardContext';
import { useAuth } from '@/contexts/AuthContext';
import './DashboardHeader.css';

export function DashboardHeader() {
  const { isMobile, isMenuOpen, isCollapsed, toggleMenu, toggleCollapse } = useDashboard();
  const { user } = useAuth();
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === '/dashboard/settings') {
      return 'Settings';
    }
    return 'Overview';
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

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
              <Menu className="dashboard-header-toggle-icon" />
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
          <div className="dashboard-header-project-info">
            <div className="dashboard-header-project-name">
              {user?.email || 'Project'}
              <span className="dashboard-header-badge dashboard-header-badge-free">Free</span>
            </div>
            <span className="dashboard-header-badge dashboard-header-badge-main">main</span>
            <span className="dashboard-header-badge dashboard-header-badge-production">Production</span>
          </div>
        </div>

        <div className="dashboard-header-bar-right">
          <button className="dashboard-header-icon-button" aria-label="Feedback" type="button">
            <MessageSquare />
          </button>
          <button className="dashboard-header-icon-button" aria-label="Notifications" type="button">
            <Bell />
          </button>
          <button className="dashboard-header-icon-button" aria-label="Help" type="button">
            <HelpCircle />
          </button>
          <button className="dashboard-header-user-button" aria-label="User menu" type="button">
            {getUserInitials()}
          </button>
        </div>
      </div>
    </header>
  );
}
