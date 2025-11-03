'use client';

import React from 'react';
import './DashboardMetrics.css';

export function DashboardMetrics() {
  return (
    <div className="dashboard-metrics-card">
      <div className="dashboard-metrics-header">
        <h2 className="dashboard-metrics-title">Performance Metrics</h2>
        <span className="dashboard-metrics-period">Last 30 days</span>
      </div>
      
      <div className="dashboard-metrics-content">
        <div className="metrics-chart-placeholder">
          <div className="metrics-bars">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="metrics-bar"
                style={{ 
                  height: `${Math.random() * 60 + 40}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="metrics-summary">
          <div className="metrics-summary-item">
            <span className="metrics-summary-label">Average</span>
            <span className="metrics-summary-value">2,431</span>
          </div>
          <div className="metrics-summary-item">
            <span className="metrics-summary-label">Peak</span>
            <span className="metrics-summary-value">4,892</span>
          </div>
          <div className="metrics-summary-item">
            <span className="metrics-summary-label">Growth</span>
            <span className="metrics-summary-value metrics-summary-positive">+15.3%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

