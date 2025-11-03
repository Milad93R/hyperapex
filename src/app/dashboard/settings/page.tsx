'use client';

import { DashboardProvider } from '@/components/dashboard/DashboardContext';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSettingsContent } from '@/components/dashboard/DashboardSettingsContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import '../dashboard.css';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <div className="dashboard-page">
          <DashboardNav />
          <DashboardHeader />
          <DashboardSettingsContent />
        </div>
      </DashboardProvider>
    </ProtectedRoute>
  );
}

