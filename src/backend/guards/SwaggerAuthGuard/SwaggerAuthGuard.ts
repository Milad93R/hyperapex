import { NextRequest, NextResponse } from 'next/server'
import { envConfig } from '../../config/EnvConfig'

/**
 * Swagger Basic Authentication Guard
 * Validates Basic Auth header for Swagger UI access
 */
export async function swaggerAuthGuard(
  request: NextRequest
): Promise<NextResponse | null> {
  const auth = request.headers.get('Authorization')

  if (!auth || !auth.startsWith('Basic ')) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Swagger UI"',
      },
    })
  }

  try {
    const credentials = atob(auth.slice(6))
    const [username, password] = credentials.split(':')

    const validUsername = envConfig.swaggerUsername
    const validPassword = envConfig.swaggerPassword

    if (
      !validUsername ||
      !validPassword ||
      username !== validUsername ||
      password !== validPassword
    ) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Swagger UI"',
        },
      })
    }

    return null // Authorized
  } catch (error) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Swagger UI"',
      },
    })
  }
}

/**
 * Decorator function to protect Swagger routes with Basic Auth
 */
export function withSwaggerAuth<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResponse = await swaggerAuthGuard(request)
    if (authResponse) return authResponse

    return handler(request, ...args)
  }
}

