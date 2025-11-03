/**
 * Client-side Supabase client
 * Used for authentication and client-side database operations
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (clientInstance) {
    return clientInstance
  }

  // Use SUPABASE_URL from .env, fallback to NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  clientInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return clientInstance
}

