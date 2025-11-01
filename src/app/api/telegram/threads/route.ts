import { NextRequest, NextResponse } from 'next/server'
import { apiKeyGuard } from '@/backend'
import { withRequestMonitoring } from '@/backend/middleware/RequestMonitoring'
import { TELEGRAM_THREADS } from '@/backend/config/TelegramConfig'

/**
 * GET /api/telegram/threads
 * Get available Telegram thread IDs
 * Optional API Key Authentication
 */
export async function GET(request: NextRequest) {
  return withRequestMonitoring(async (req: NextRequest) => {
    // Check if API key is provided (optional for this endpoint)
    const authResponse = await apiKeyGuard(req)
    const isAuthenticated = !authResponse

    return NextResponse.json({
      threads: TELEGRAM_THREADS,
      description: {
        DEFAULT: 'Default thread - always included in all messages',
        OTHER: 'Additional thread for custom routing',
      },
      timestamp: new Date().toISOString(),
      authenticated: isAuthenticated,
    })
  })(request)
}

