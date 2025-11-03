'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SITE_CONFIG } from '@/config/constants';
import { useAuth } from '@/contexts/AuthContext';
import '../auth.css';

interface LoginFormProps {
  onSwitchToSignUp?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if user just confirmed their email
    const confirmed = searchParams.get('confirmed');
    const errorParam = searchParams.get('error');
    
    if (confirmed === 'true') {
      setSuccessMessage('Email confirmed successfully! Please sign in.');
    }
    
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // OAuth redirect will happen automatically
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 className="auth-title">{SITE_CONFIG.name}</h1>
          </Link>
        </div>
        <p className="auth-subtitle">Sign in to your account</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="auth-google-button"
        >
          {googleLoading ? (
            'Connecting...'
          ) : (
            <>
              <svg className="auth-google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="auth-options">
            <label className="auth-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link href="#forgot" className="auth-link">
              Forgot password?
            </Link>
          </div>

          {successMessage && (
            <div className="auth-success">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button type="submit" className="btn-secondary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don&apos;t have an account?{' '}
            {onSwitchToSignUp ? (
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="auth-link-button"
              >
                Sign up
              </button>
            ) : (
              <Link href="/signup" className="auth-link">
                Sign up
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

