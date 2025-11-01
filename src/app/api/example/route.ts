import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedHandler } from '@/backend'
import { validateRequestBody, sanitizeObject } from '@/backend'
import { isDebugMode, DebugLogCapture } from '@/backend'

/**
 * Example API route demonstrating:
 * - API Key Authentication
 * - Input Validation
 * - Debug Mode Support
 */
export const POST = createAuthenticatedHandler(async (request: NextRequest) => {
  const debugMode = isDebugMode(request)
  const logCapture = new DebugLogCapture(debugMode)

  try {
    // Validate request body
    const validation = await validateRequestBody<{
      name?: string
      email?: string
      message?: string
    }>(request)

    if (validation.error) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error,
        },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitized = sanitizeObject(validation.data)

    // Process the request
    console.log('Processing request:', sanitized)

    const response = NextResponse.json({
      success: true,
      message: 'Request processed successfully',
      data: sanitized,
      timestamp: new Date().toISOString(),
      ...(debugMode && {
        debug: {
          logs: logCapture.getLogs(),
          mode: 'enabled',
        },
      }),
    })

    return response
  } catch (error) {
    console.error('Error processing request:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        ...(debugMode && {
          debug: {
            logs: logCapture.getLogs(),
            stack: error instanceof Error ? error.stack : undefined,
          },
        }),
      },
      { status: 500 }
    )
  } finally {
    logCapture.restore()
  }
})

