'use client';

import { DashboardProvider } from '@/components/dashboard/DashboardContext';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import './dashboard.css';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <div className="dashboard-page">
          <DashboardNav />
          <DashboardHeader />
          <DashboardContent />
        </div>
      </DashboardProvider>
    </ProtectedRoute>
  );
}

