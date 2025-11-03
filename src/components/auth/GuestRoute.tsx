'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * GuestRoute - Redirects authenticated users away from login/signup pages
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
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

  if (user) {
    return null;
  }

  return <>{children}</>;
}

