'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SITE_CONFIG } from '@/config/constants';
import { useAuth } from '@/contexts/AuthContext';
import '../auth.css';

interface SignUpFormProps {
  onSwitchToLogin?: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin }) => {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, formData.name);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Optionally redirect to login or dashboard after confirmation
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
        <p className="auth-subtitle">Join us and start your journey</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="name" className="auth-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="auth-input"
              placeholder="John Doe"
              required
              style={{ position: 'relative', zIndex: 2, background: 'transparent', border: 'none' }}
            />
          </div>

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

          <div className="auth-form-group">
            <label htmlFor="confirmPassword" className="auth-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="auth-input"
              placeholder="••••••••"
              required
              style={{ position: 'relative', zIndex: 2, background: 'transparent', border: 'none' }}
            />
          </div>

          <div className="auth-options">
            <label className="auth-checkbox">
              <input type="checkbox" required />
              <span>
                I agree to the{' '}
                <Link href="#terms" className="auth-link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#privacy" className="auth-link">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {error && (
            <div className="auth-error" style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success" style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.875rem' }}>
              Account created! Please check your email to confirm your account.
            </div>
          )}

          <button type="submit" className="btn-secondary auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="auth-link-button"
              >
                Sign in
              </button>
            ) : (
              <Link href="/login" className="auth-link">
                Sign in
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

