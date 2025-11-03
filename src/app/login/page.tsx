'use client';

import { Suspense } from 'react';
import { LoginForm } from '@/components/auth';
import { GuestRoute } from '@/components/auth/GuestRoute';

export default function LoginPage() {
  return (
    <GuestRoute>
      <div className="landing-page">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </GuestRoute>
  );
}

