import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ALLOWED_DASHBOARD_EMAILS } from '@/config/constants';

/**
 * Handles Supabase auth callbacks (email confirmation, OAuth, password reset, etc.)
 * Redirects appropriately based on the type of callback
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const type = requestUrl.searchParams.get('type'); // OAuth, email, etc.

  if (error) {
    // If there's an error in the callback, redirect to login with error
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', errorDescription || error);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError && data.session) {
        // Check if it's a password recovery flow
        if (type === 'recovery') {
          // Password recovery - redirect to reset password page
          const resetUrl = new URL('/auth/reset-password', request.url);
          return NextResponse.redirect(resetUrl);
        }
        
        // If allowed emails list is empty, all users are allowed
        if (ALLOWED_DASHBOARD_EMAILS.length === 0) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Check if user's email is authorized for dashboard access
        const userEmail = data.session.user.email?.toLowerCase();
        const isEmailAllowed = userEmail && ALLOWED_DASHBOARD_EMAILS.some(
          allowedEmail => allowedEmail.toLowerCase() === userEmail
        );

        if (isEmailAllowed) {
          // Authorized user - redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          // Unauthorized user - redirect to login with error
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('error', 'Access denied. You do not have permission to access the dashboard.');
          return NextResponse.redirect(loginUrl);
        }
      }
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}

