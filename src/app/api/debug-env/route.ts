import { NextRequest, NextResponse } from 'next/server'
import { envConfig } from '@/backend/config'
import { withRequestMonitoring } from '@/backend/middleware/RequestMonitoring'

/**
 * Environment debug endpoint
 * Access at: http://localhost:3168/api/debug-env
 * Public endpoint - no authentication required
 * 
 * Shows environment variable configuration (without exposing actual values)
 * Useful for debugging configuration issues
 */
export async function GET(request: NextRequest) {
  return withRequestMonitoring(async (req: NextRequest) => {
    const username = envConfig.swaggerUsername || ''
  const password = envConfig.swaggerPassword || ''
  const apiKey = envConfig.apiKey || ''
  const debugSecret = envConfig.debugSecret || ''
  const customDomain = envConfig.customDomain || ''

  // Get request info
  const ip =
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    request.headers.get('X-Real-IP') ||
    request.headers.get('CF-Connecting-IP') ||
    'Unknown'

  return NextResponse.json(
    {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      requestInfo: {
        method: req.method,
        path: req.nextUrl.pathname,
        ip,
        userAgent: req.headers.get('user-agent'),
      },
      configuration: {
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey.length,
        hasSwaggerUsername: !!username,
        swaggerUsernameLength: username.length,
        hasSwaggerPassword: !!password,
        swaggerPasswordLength: password.length,
        hasDebugSecret: !!debugSecret,
        debugSecretLength: debugSecret.length,
        hasCustomDomain: !!customDomain,
        customDomain: customDomain || 'Not configured',
      },
      // Character analysis (to detect hidden characters like \\r\\n)
      characterAnalysis: {
        usernameChars: Array.from(username).map((c, i) => ({
          index: i,
          char: c,
          code: c.charCodeAt(0),
          name: getCharName(c.charCodeAt(0)),
        })),
        passwordChars: Array.from(password).map((c, i) => ({
          index: i,
          char: c,
          code: c.charCodeAt(0),
          name: getCharName(c.charCodeAt(0)),
        })),
        apiKeyChars: apiKey.length > 0 ? Array.from(apiKey.substring(0, 5)).map((c, i) => ({
          index: i,
          char: c,
          code: c.charCodeAt(0),
        })) : [],
      },
      // Test comparisons (useful for debugging)
      tests: {
        usernameMatches: username === 'admin',
        usernameMatchesTrimmed: username.trim() === 'admin',
        passwordMatches: password === 'admin123',
        passwordMatchesTrimmed: password.trim() === 'admin123',
      },
      note: 'This endpoint shows configuration status without exposing sensitive values. Character analysis helps detect hidden characters (like \\r\\n) that might cause issues.',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  )
  })(request)
}

/**
 * Get human-readable character name
 */
function getCharName(code: number): string {
  const charNames: Record<number, string> = {
    9: 'Tab',
    10: 'Line Feed (\\n)',
    13: 'Carriage Return (\\r)',
    32: 'Space',
  }

  if (code >= 33 && code <= 126) {
    return String.fromCharCode(code)
  }

  return charNames[code] || `U+${code.toString(16).toUpperCase()}`
}

