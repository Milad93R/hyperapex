import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
        // For OAuth, user is automatically logged in - redirect to dashboard
        // For email confirmation, if user is logged in, also redirect to dashboard
        // Only redirect to login if it's a password recovery flow
        if (type === 'recovery') {
          // Password recovery - redirect to reset password page
          const resetUrl = new URL('/auth/reset-password', request.url);
          return NextResponse.redirect(resetUrl);
        } else {
          // OAuth or email confirmation with session - redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}

