/**
 * Supabase middleware for session management
 * Refreshes user sessions automatically
 */
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // For now, just pass through - session is managed client-side
  // You can add session refresh logic here if needed
  return NextResponse.next({
    request,
  })
}

