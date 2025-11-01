import { NextRequest, NextResponse } from 'next/server'
import { apiKeyGuard } from '@/backend'
import { withRequestMonitoring } from '@/backend/middleware/RequestMonitoring'
import { CacheUtil } from '@/backend/utils/CacheUtil'

/**
 * Example API route
 * Access without auth: http://localhost:3168/api
 * Access with auth: Add header X-API-Key: your-api-key-here
 */
export async function GET(request: NextRequest) {
  return withRequestMonitoring(async (req: NextRequest) => {
    // Check if API key is provided (optional for this endpoint)
    const authResponse = await apiKeyGuard(req)
    const isAuthenticated = !authResponse

    return CacheUtil.cachedJsonResponse(
      {
        message: 'Hello from Next.js API route!',
        timestamp: new Date().toISOString(),
        authenticated: isAuthenticated,
        note: isAuthenticated
          ? 'Access granted with valid API key'
          : 'To authenticate, add header: X-API-Key: your-api-key-here',
      },
      'API'
    )
  })(request)
}

export async function POST(request: NextRequest) {
  return withRequestMonitoring(async (req: NextRequest) => {
    // Check if API key is provided (optional for this endpoint)
    const authResponse = await apiKeyGuard(req)
    const isAuthenticated = !authResponse

    const body = await req.json().catch(() => null)

    return NextResponse.json({
      message: 'POST request successful',
      receivedData: body,
      timestamp: new Date().toISOString(),
      authenticated: isAuthenticated,
    })
  })(request)
}
