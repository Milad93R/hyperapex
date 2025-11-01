import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedHandler } from '@/backend'
import { validateRequestBody } from '@/backend'
import { withRequestMonitoring } from '@/backend/middleware/RequestMonitoring'
import { withErrorHandler } from '@/backend/handlers'

// Use Node.js runtime for sleep operations
export const runtime = 'nodejs'

/**
 * Sleep API endpoint for testing delays and timeouts
 * Access at: http://localhost:3168/api/sleep
 * Requires API Key authentication
 * 
 * Useful for:
 * - Testing request timeouts
 * - Testing long-running operations
 * - Testing Vercel function duration limits
 * - Testing client-side timeout handling
 */
export const POST = createAuthenticatedHandler(
  withRequestMonitoring(
    withErrorHandler(async (request: NextRequest) => {
      try {
        // Validate request body
        const validation = await validateRequestBody<{
          duration?: number
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

        const { duration = 5000, message = 'Slept successfully' } = validation.data

        // Validate duration
        if (duration < 0) {
          return NextResponse.json(
            { error: 'Duration must be non-negative' },
            { status: 400 }
          )
        }

        if (duration > 60000) {
          return NextResponse.json(
            { error: 'Duration too large (max 60,000ms = 60 seconds)' },
            { status: 400 }
          )
        }

        const startTime = performance.now()

        // Sleep for specified duration
        await new Promise((resolve) => setTimeout(resolve, duration))

        const actualDuration = performance.now() - startTime

        return NextResponse.json({
          success: true,
          message,
          requestedDuration: `${duration}ms`,
          actualDuration: `${actualDuration.toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Error in sleep endpoint:', error)

        return NextResponse.json(
          {
            error: 'Sleep operation failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        )
      }
    }, [])
  )
)

/**
 * GET endpoint with query parameter for duration
 */
export const GET = createAuthenticatedHandler(
  withRequestMonitoring(
    withErrorHandler(async (request: NextRequest) => {
      try {
        const { searchParams } = request.nextUrl
        const durationParam = searchParams.get('duration')
        const duration = durationParam ? parseInt(durationParam, 10) : 5000

        // Validate duration
        if (isNaN(duration) || duration < 0) {
          return NextResponse.json(
            { error: 'Invalid duration parameter (must be a non-negative number)' },
            { status: 400 }
          )
        }

        if (duration > 60000) {
          return NextResponse.json(
            { error: 'Duration too large (max 60,000ms = 60 seconds)' },
            { status: 400 }
          )
        }

        const startTime = performance.now()

        // Sleep for specified duration
        await new Promise((resolve) => setTimeout(resolve, duration))

        const actualDuration = performance.now() - startTime

        return NextResponse.json({
          success: true,
          message: 'Slept successfully',
          requestedDuration: `${duration}ms`,
          actualDuration: `${actualDuration.toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Error in sleep endpoint:', error)

        return NextResponse.json(
          {
            error: 'Sleep operation failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        )
      }
    }, [])
  )
)

