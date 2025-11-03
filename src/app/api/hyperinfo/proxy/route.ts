import { NextRequest, NextResponse } from 'next/server'
import { envConfig } from '@/backend/config/EnvConfig'

/**
 * Server-side proxy for hyperinfo API
 * This endpoint acts as a proxy to avoid exposing API key to the client
 * It uses the server-side API_KEY from environment variables
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiKey = envConfig.apiKey

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      )
    }

    // Forward the request to the hyperinfo endpoint with server-side API key
    const response = await fetch(`${request.nextUrl.origin}/api/hyperinfo`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Proxy error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

