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
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 className="auth-title">{SITE_CONFIG.name}</h1>
          </Link>
        </div>
        <p className="auth-subtitle">Sign in to your account</p>

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
              style={{ position: 'relative', zIndex: 2, background: 'transparent', border: 'none' }}
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
              style={{ position: 'relative', zIndex: 2, background: 'transparent', border: 'none' }}
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
            <div className="auth-success" style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="auth-error" style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
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

