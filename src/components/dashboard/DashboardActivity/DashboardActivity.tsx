'use client';

import React from 'react';
import './DashboardActivity.css';

interface ActivityItem {
  id: string;
  type: 'user' | 'system' | 'update';
  message: string;
  time: string;
}

export function DashboardActivity() {
  const activities: ActivityItem[] = [
    { id: '1', type: 'user', message: 'New user registration', time: '2m ago' },
    { id: '2', type: 'system', message: 'System backup completed', time: '15m ago' },
    { id: '3', type: 'update', message: 'Database schema updated', time: '1h ago' },
    { id: '4', type: 'user', message: 'Profile updated', time: '2h ago' },
    { id: '5', type: 'system', message: 'Performance optimization', time: '3h ago' },
  ];

  return (
    <div className="dashboard-activity-card">
      <div className="dashboard-activity-header">
        <h2 className="dashboard-activity-title">Recent Activity</h2>
      </div>
      
      <div className="dashboard-activity-content">
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-content">
                <p className="activity-message">{activity.message}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

