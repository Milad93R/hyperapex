import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Handles Supabase auth callbacks (email confirmation, password reset, etc.)
 * Redirects to login after email confirmation
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

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
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        // Successful confirmation, redirect to login with success message
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('confirmed', 'true');
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}

