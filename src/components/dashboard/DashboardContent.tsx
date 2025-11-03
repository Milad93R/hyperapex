'use client';

import React from 'react';
import { useDashboard } from './DashboardContext';
import { DashboardStats } from './DashboardStats';
import { DashboardMetrics } from './DashboardMetrics';
import { DashboardActivity } from './DashboardActivity';
import { DashboardRecent } from './DashboardRecent';

export function DashboardContent() {
  const { isMobile, isCollapsed } = useDashboard();

  return (
    <main className="dashboard-main" data-collapsed={!isMobile && isCollapsed}>
      <div className="dashboard-container">
        <DashboardStats />
        
        <div className="dashboard-grid">
          <div className="dashboard-grid-main">
            <DashboardMetrics />
            <DashboardRecent />
          </div>
          <div className="dashboard-grid-sidebar">
            <DashboardActivity />
          </div>
        </div>
      </div>
    </main>
  );
}

