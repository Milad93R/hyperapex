import { NextRequest, NextResponse } from 'next/server'
import { getOpenAPISpec } from '@/backend/config'

/**
 * OpenAPI 3.0 Specification endpoint
 * Access at: http://localhost:3168/api/openapi.json
 * Public endpoint - no authentication required
 * 
 * Features:
 * - Dynamic server URLs (production, deployment, custom domain, local)
 * - Complete endpoint documentation
 * - Comprehensive schemas
 */
export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin
  const openApiSpec = getOpenAPISpec(baseUrl)

  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

