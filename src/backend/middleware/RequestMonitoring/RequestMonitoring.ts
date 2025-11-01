import { NextRequest, NextResponse } from 'next/server'

/**
 * Request metrics interface
 */
export interface RequestMetrics {
  timestamp: string
  method: string
  path: string
  status: number
  duration: number
  userAgent?: string
  ip?: string
  error?: string
}

/**
 * Request monitoring middleware
 * Tracks request duration, method, path, status, user agent, and IP address
 * 
 * Usage:
 * ```ts
 * const startTime = Date.now()
 * const response = await handler(request)
 * const metrics = getRequestMetrics(request, response, startTime)
 * logRequestMetrics(metrics)
 * ```
 */
export function getRequestMetrics(
  request: NextRequest,
  response: NextResponse,
  startTime: number
): RequestMetrics {
  const duration = Date.now() - startTime
  const path = request.nextUrl.pathname + request.nextUrl.search

  // Get IP address from headers (common headers for proxy/load balancer)
  const ip =
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    request.headers.get('X-Real-IP') ||
    request.headers.get('CF-Connecting-IP') ||
    'Unknown'

  return {
    timestamp: new Date().toISOString(),
    method: request.method,
    path,
    status: response.status,
    duration,
    userAgent: request.headers.get('user-agent') || undefined,
    ip,
  }
}

/**
 * Log request metrics to console
 */
export function logRequestMetrics(metrics: RequestMetrics): void {
  const logMessage = [
    `[${metrics.timestamp}]`,
    `${metrics.method} ${metrics.path}`,
    `${metrics.status}`,
    `${metrics.duration}ms`,
    metrics.ip !== 'Unknown' ? `IP: ${metrics.ip}` : '',
  ]
    .filter(Boolean)
    .join(' | ')

  console.log(logMessage)
}

/**
 * Wrap handler with request monitoring
 */
export function withRequestMonitoring<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now()
    let response: NextResponse

    try {
      response = await handler(request, ...args)
    } catch (error) {
      // Create error response
      response = NextResponse.json(
        {
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    const metrics = getRequestMetrics(request, response, startTime)
    logRequestMetrics(metrics)

    return response
  }
}

