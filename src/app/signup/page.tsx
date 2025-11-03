'use client';

import { SignUpForm } from '@/components/auth';
import { GuestRoute } from '@/components/auth/GuestRoute';

export default function SignUpPage() {
  return (
    <GuestRoute>
      <div className="landing-page">
        <SignUpForm />
      </div>
    </GuestRoute>
  );
}

