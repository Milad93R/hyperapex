import { NextRequest, NextResponse } from 'next/server'
import { apiKeyGuard } from '../../guards/ApiKeyGuard'

/**
 * Public routes that don't require API key authentication
 */
const PUBLIC_ROUTES = ['/', '/api', '/api/docs', '/api/openapi.json', '/api/debug-env']

/**
 * Authentication middleware for Next.js API routes
 * Checks if route requires auth and validates API key
 */
export async function authMiddleware(
  request: NextRequest
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname

  // Skip auth for public routes
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return null
  }

  // Require API key for all other routes
  return await apiKeyGuard(request)
}

/**
 * Create authenticated API route handler
 * Automatically applies API key authentication
 */
export function createAuthenticatedHandler<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResponse = await authMiddleware(request)
    if (authResponse) return authResponse

    return handler(request, ...args)
  }
}

