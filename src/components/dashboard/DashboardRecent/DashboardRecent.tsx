'use client';

import React from 'react';
import './DashboardRecent.css';

interface RecentItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed';
  date: string;
}

export function DashboardRecent() {
  const recentItems: RecentItem[] = [
    {
      id: '1',
      title: 'Project Alpha',
      description: 'Frontend development in progress',
      status: 'active',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Project Beta',
      description: 'Awaiting approval',
      status: 'pending',
      date: '2024-01-14'
    },
    {
      id: '3',
      title: 'Project Gamma',
      description: 'Successfully completed',
      status: 'completed',
      date: '2024-01-13'
    },
    {
      id: '4',
      title: 'Project Delta',
      description: 'Initial setup phase',
      status: 'active',
      date: '2024-01-12'
    }
  ];

  return (
    <div className="dashboard-recent-card">
      <div className="dashboard-recent-header">
        <h2 className="dashboard-recent-title">Recent Projects</h2>
      </div>
      
      <div className="dashboard-recent-content">
        <div className="recent-list">
          {recentItems.map((item) => (
            <div key={item.id} className="recent-item">
              <div className="recent-item-header">
                <h3 className="recent-item-title">{item.title}</h3>
                <span className={`recent-item-status recent-item-status-${item.status}`}>
                  {item.status}
                </span>
              </div>
              <p className="recent-item-description">{item.description}</p>
              <span className="recent-item-date">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

