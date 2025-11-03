'use client';

import React from 'react';
import './DashboardStats.css';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-header">
          <h3 className="stat-card-title">{title}</h3>
          {icon && <div className="stat-card-icon">{icon}</div>}
        </div>
        <div className="stat-card-value">{value}</div>
        {change && (
          <div className={`stat-card-change stat-card-change-${changeType}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardStats() {
  const stats = [
    {
      title: 'Total Users',
      value: '12,543',
      change: '+12.5% from last month',
      changeType: 'positive' as const
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+8.2% from last month',
      changeType: 'positive' as const
    },
    {
      title: 'Active Sessions',
      value: '2,341',
      change: '+5.1% from last month',
      changeType: 'positive' as const
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-0.3% from last month',
      changeType: 'negative' as const
    }
  ];

  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

