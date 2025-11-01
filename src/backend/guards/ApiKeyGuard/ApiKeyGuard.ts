import { NextRequest, NextResponse } from 'next/server'
import { envConfig } from '../../config/EnvConfig'

/**
 * API Key Guard - Validates X-API-Key header
 * 
 * Usage:
 * ```ts
 * const response = await apiKeyGuard(request)
 * if (response) return response // Unauthorized
 * // Continue with your handler
 * ```
 */
export async function apiKeyGuard(
  request: NextRequest
): Promise<NextResponse | null> {
  const apiKey = envConfig.apiKey
  const providedKey = request.headers.get('X-API-Key')

  if (!apiKey || providedKey !== apiKey) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: 'Invalid or missing API key. Provide X-API-Key header.',
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    )
  }

  return null // Authorized
}

/**
 * Decorator function to protect API routes with API key
 */
export function withApiKey<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResponse = await apiKeyGuard(request)
    if (authResponse) return authResponse

    return handler(request, ...args)
  }
}

