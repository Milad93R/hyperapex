import { NextRequest, NextResponse } from 'next/server'
import { isDebugMode } from '../../utils/DebugUtil'

/**
 * Error response interface
 */
export interface ErrorResponse {
  error: string
  message: string
  timestamp: string
  path?: string
  stack?: string
  capturedLogs?: Array<{
    level: string
    message: string
    timestamp: string
  }>
}

/**
 * Create error response with optional debug information
 */
export function createErrorResponse(
  request: NextRequest,
  error: Error | unknown,
  status = 500,
  capturedLogs?: Array<{ level: string; message: string; timestamp: string }>
): NextResponse<ErrorResponse> {
  const debugMode = isDebugMode(request)
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  const errorStack = error instanceof Error ? error.stack : undefined

  const errorResponse: ErrorResponse = {
    error: status >= 500 ? 'Internal Server Error' : 'Request Error',
    message: errorMessage,
    timestamp: new Date().toISOString(),
    path: request.nextUrl.pathname,
  }

  // Include debug information if debug mode is enabled
  if (debugMode) {
    errorResponse.stack = errorStack
    if (capturedLogs && capturedLogs.length > 0) {
      errorResponse.capturedLogs = capturedLogs
    }
  }

  return NextResponse.json(errorResponse, { status })
}

/**
 * Global error handler wrapper for API routes
 * Automatically handles errors and includes debug info when available
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  capturedLogs?: Array<{ level: string; message: string; timestamp: string }>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      console.error('Error in API route:', error)
      return createErrorResponse(request, error, 500, capturedLogs)
    }
  }
}

/**
 * Handle validation errors (400)
 */
export function createValidationErrorResponse(
  request: NextRequest,
  message: string,
  details?: Record<string, unknown>
): NextResponse {
  const debugMode = isDebugMode(request)

  return NextResponse.json(
    {
      error: 'Validation Error',
      message,
      timestamp: new Date().toISOString(),
      path: request.nextUrl.pathname,
      ...(debugMode && details && { details }),
    },
    { status: 400 }
  )
}

/**
 * Handle not found errors (404)
 */
export function createNotFoundResponse(request: NextRequest): NextResponse {
  return NextResponse.json(
    {
      error: 'Not Found',
      message: `The requested path ${request.nextUrl.pathname} was not found`,
      timestamp: new Date().toISOString(),
      path: request.nextUrl.pathname,
    },
    { status: 404 }
  )
}

