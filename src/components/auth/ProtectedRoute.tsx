'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ALLOWED_DASHBOARD_EMAILS } from '@/config/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // If allowed emails list is empty, all users are allowed
    if (ALLOWED_DASHBOARD_EMAILS.length === 0) {
      setIsAuthorized(true);
      return;
    }

    // Check if user's email is in the allowed list
    const userEmail = user.email?.toLowerCase();
    const isEmailAllowed = userEmail && ALLOWED_DASHBOARD_EMAILS.some(
      allowedEmail => allowedEmail.toLowerCase() === userEmail
    );

    if (!isEmailAllowed) {
      // User is authenticated but not authorized
      setIsAuthorized(false);
      // Sign out the unauthorized user and redirect to login
      router.push('/login?error=Access denied. You do not have permission to access the dashboard.');
      return;
    }

    setIsAuthorized(true);
  }, [user, loading, router]);

  if (loading || isAuthorized === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

