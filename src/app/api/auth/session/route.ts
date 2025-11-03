import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase not configured');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await getServerClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      session: session ? {
        user: {
          id: session.user.id,
          email: session.user.email,
        },
        expires_at: session.expires_at,
      } : null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

