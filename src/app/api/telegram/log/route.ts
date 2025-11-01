import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedHandler } from '@/backend'
import { withRequestMonitoring } from '@/backend/middleware/RequestMonitoring'
import { withErrorHandler } from '@/backend/handlers'
import { validateRequestBody } from '@/backend'
import { TelegramService } from '@/backend/services/TelegramService'
import { envConfig } from '@/backend/config'

/**
 * POST /api/telegram/log
 * Send a formatted log message to Telegram threads
 * Requires API Key Authentication
 */
export const POST = createAuthenticatedHandler(
  withRequestMonitoring(
    withErrorHandler(async (request: NextRequest) => {
      // Validate request body
      const validation = await validateRequestBody<{
        level?: string
        message: string
        threads?: number[]
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

      const { level = 'INFO', message, threads } = validation.data

      if (!message) {
        return NextResponse.json(
          {
            error: 'Message is required',
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        )
      }

      const botToken = envConfig.telegramBotToken || ''
      const telegramService = new TelegramService(botToken)
      const results = await telegramService.logtelFormatted(level, message, threads)

      return NextResponse.json({
        message: 'Log sent',
        level: level,
        results: results,
        timestamp: new Date().toISOString(),
      })
    })
  )
)

