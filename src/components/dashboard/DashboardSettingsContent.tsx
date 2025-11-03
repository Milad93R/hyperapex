'use client';

import React from 'react';
import { useDashboard } from './DashboardContext';
import { Info, AlertCircle } from 'lucide-react';
import './DashboardContent.css';

export function DashboardSettingsContent() {
  const { isMobile, isCollapsed } = useDashboard();

  return (
    <main className="dashboard-main" data-collapsed={!isMobile && isCollapsed}>
      <div className="dashboard-container">
        <h1 className="dashboard-page-title">Project Settings</h1>

        <div className="dashboard-section">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="dashboard-card-title">General settings</h2>
            </div>
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Project name</label>
              <input 
                type="text" 
                className="dashboard-form-input" 
                defaultValue="My Project"
                readOnly
              />
            </div>
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Project ID</label>
              <input 
                type="text" 
                className="dashboard-form-input" 
                defaultValue="abcdefghijklmnop"
                readOnly
              />
            </div>
            <div className="dashboard-form-actions">
              <button className="dashboard-button dashboard-button-secondary">Cancel</button>
              <button className="dashboard-button dashboard-button-primary">Save</button>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="dashboard-card-title">Restart project</h2>
            </div>
            <p className="dashboard-card-description">
              Your project will not be available for a few minutes.
            </p>
            <div className="dashboard-card-actions">
              <button className="dashboard-button dashboard-button-secondary">
                Restart project
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="dashboard-card-title">Pause project</h2>
            </div>
            <p className="dashboard-card-description">
              Your project will not be accessible while it is paused.
            </p>
            <div className="dashboard-card-actions">
              <button className="dashboard-button dashboard-button-secondary">
                Pause project
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-card">
            <div className="dashboard-info-box">
              <Info className="dashboard-info-icon" />
              <div className="dashboard-info-content">
                <div className="dashboard-info-title">Project usage statistics have been moved</div>
                <div className="dashboard-info-text">
                  You may view your project&apos;s usage under your organization&apos;s settings.
                </div>
              </div>
              <button className="dashboard-button dashboard-button-secondary" style={{ flexShrink: 0 }}>
                View project usage
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="dashboard-card-title">Custom Domains</h2>
            </div>
            <p className="dashboard-card-description">
              Present a branded experience to your users.
            </p>
            <div className="dashboard-info-box">
              <AlertCircle className="dashboard-info-icon" />
              <div className="dashboard-info-content">
                <div className="dashboard-info-title">Custom domains are a Pro Plan add-on</div>
                <div className="dashboard-info-text">
                  Paid Plans come with free vanity subdomains or Custom Domains for an additional $10/month per domain.
                </div>
              </div>
            </div>
            <div className="dashboard-card-actions">
              <button className="dashboard-button dashboard-button-primary">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

