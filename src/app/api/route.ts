import { NextRequest, NextResponse } from 'next/server'
import { apiKeyGuard } from '@/backend'

/**
 * Example API route
 * Access without auth: http://localhost:3168/api
 * Access with auth: Add header X-API-Key: your-api-key-here
 */
export async function GET(request: NextRequest) {
  // Check if API key is provided (optional for this endpoint)
  const authResponse = await apiKeyGuard(request)
  const isAuthenticated = !authResponse

  return NextResponse.json(
    {
      message: 'Hello from Next.js API route!',
      timestamp: new Date().toISOString(),
      authenticated: isAuthenticated,
      note: isAuthenticated 
        ? 'Access granted with valid API key' 
        : 'To authenticate, add header: X-API-Key: your-api-key-here',
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export async function POST(request: NextRequest) {
  // Check if API key is provided (optional for this endpoint)
  const authResponse = await apiKeyGuard(request)
  const isAuthenticated = !authResponse

  const body = await request.json().catch(() => null)

  return NextResponse.json({
    message: 'POST request successful',
    receivedData: body,
    timestamp: new Date().toISOString(),
    authenticated: isAuthenticated,
  })
}
