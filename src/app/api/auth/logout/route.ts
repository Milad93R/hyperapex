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

export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerClient();
    await supabase.auth.signOut();
    
    return NextResponse.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}

