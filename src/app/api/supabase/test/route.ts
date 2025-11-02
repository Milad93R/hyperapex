import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedHandler, SupabaseService } from '@/backend'
import { withRequestMonitoring } from '@/backend/middleware/RequestMonitoring'
import { withErrorHandler } from '@/backend/handlers'

/**
 * Supabase Test/Status Endpoint
 * Checks if Supabase is configured and working.
 * Requires API Key authentication.
 */
export const GET = createAuthenticatedHandler(
  withRequestMonitoring(
    withErrorHandler(async (request: NextRequest) => {
      try {
        const isConfigured = SupabaseService.isConfigured()

        if (!isConfigured) {
          return NextResponse.json(
            {
              success: false,
              message: 'Supabase is not configured',
              configured: false,
              timestamp: new Date().toISOString(),
              note: 'Please check your environment variables: SUPABASE_URL and SUPABASE_SERVICE_KEY',
            },
            { status: 503 }
          )
        }

        // Try to get the client (this will validate the connection)
        const client = SupabaseService.getClient()
        const supabaseUrl = process.env.SUPABASE_URL

        return NextResponse.json({
          success: true,
          message: 'Supabase is configured and ready to use',
          configured: true,
          supabaseUrl: supabaseUrl || 'Not set',
          timestamp: new Date().toISOString(),
          note: 'You can now use SupabaseService to interact with your database',
        })
      } catch (error) {
        console.error('Error in Supabase test endpoint:', error)
        throw error // ErrorHandler will catch and format this
      }
    })
  )
)

