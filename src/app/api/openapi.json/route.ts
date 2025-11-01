import { NextRequest, NextResponse } from 'next/server'
import { getOpenAPISpec } from '@/backend/config'
import { CacheUtil } from '@/backend/utils/CacheUtil'

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

  const response = CacheUtil.cachedJsonResponse(openApiSpec, 'OPENAPI')
  response.headers.set('ETag', `"${Date.now()}"`) // Simple ETag for cache validation
  return response
}

