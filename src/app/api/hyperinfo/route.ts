import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedHandler } from '@/backend'
import { validateRequestBody } from '@/backend'
import { isDebugMode, DebugLogCapture } from '@/backend'
import { withRequestMonitoring } from '@/backend/middleware/RequestMonitoring'
import { withErrorHandler } from '@/backend/handlers'
import { HyperinfoService } from '@/backend/services/hyperinfo'

/**
 * Hyperinfo API endpoint
 * Access at: http://localhost:3168/api/hyperinfo
 * Requires API Key authentication
 * 
 * Wrapper for Hyperliquid API (https://api.hyperliquid.xyz/info)
 * 
 * Supported request types:
 * - userNonFundingLedgerUpdates: Get user ledger updates
 * - userFillsByTime: Get user fills by time
 * - custom: Any other Hyperliquid API call
 */
export const POST = createAuthenticatedHandler(
  withRequestMonitoring(
    withErrorHandler(async (request: NextRequest) => {
      const debugMode = isDebugMode(request)
      const logCapture = new DebugLogCapture(debugMode)

      try {
        // Validate request body
        const validation = await validateRequestBody<{
          type: 'userNonFundingLedgerUpdates' | 'userFillsByTime' | 'custom'
          user?: string // Required for userNonFundingLedgerUpdates and userFillsByTime
          startTime?: number // Required for userNonFundingLedgerUpdates and userFillsByTime
          payload?: Record<string, unknown> // For custom type
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

        const { type, ...params } = validation.data
        const startTime = performance.now()

        let result: unknown

        // Handle different request types
        if (type === 'userNonFundingLedgerUpdates') {
          if (!params.user || params.startTime === undefined) {
            return NextResponse.json(
              { error: 'Missing required parameters: user, startTime' },
              { status: 400 }
            )
          }
          result = await HyperinfoService.getUserNonFundingLedgerUpdates(
            params.user,
            params.startTime
          )
        } else if (type === 'userFillsByTime') {
          if (!params.user || params.startTime === undefined) {
            return NextResponse.json(
              { error: 'Missing required parameters: user, startTime' },
              { status: 400 }
            )
          }
          result = await HyperinfoService.getUserFillsByTime(
            params.user,
            params.startTime
          )
        } else if (type === 'custom' && params.payload) {
          result = await HyperinfoService.callApi(params.payload)
        } else {
          // For any other type or custom without payload, forward the entire body as payload
          result = await HyperinfoService.callApi({ type, ...params })
        }

        const duration = performance.now() - startTime

        const response = NextResponse.json({
          success: true,
          type,
          data: result,
          duration: `${duration.toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
          ...(debugMode && {
            debug: {
              logs: logCapture.getLogs(),
              mode: 'enabled',
              input: params,
            },
          }),
        })

        return response
      } catch (error) {
        console.error('Error calling Hyperliquid API:', error)

        return NextResponse.json(
          {
            error: 'Hyperliquid API error',
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
    }, [])
  )
)

