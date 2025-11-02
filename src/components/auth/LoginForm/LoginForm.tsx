'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/config/constants';
import '../auth.css';

interface LoginFormProps {
  onSwitchToSignUp?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no backend connection
    console.log('Login form submitted:', formData);
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

          <button type="submit" className="btn-secondary auth-submit">
            Sign In
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

