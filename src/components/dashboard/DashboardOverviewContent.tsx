'use client';

import React from 'react';
import { useDashboard } from './DashboardContext';
import './DashboardContent.css';

export function DashboardOverviewContent() {
  const { isMobile, isCollapsed } = useDashboard();

  return (
    <main className="dashboard-main" data-collapsed={!isMobile && isCollapsed}>
      <div className="dashboard-container">
        <h1 className="dashboard-page-title">Overview</h1>
        <p className="dashboard-card-description" style={{ marginBottom: '20px' }}>
          Welcome back! Here&apos;s what&apos;s happening.
        </p>

        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Quick Stats</h2>
          <div className="dashboard-card">
            <p className="dashboard-card-description">
              Get started by exploring your project settings or viewing your dashboard statistics.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

