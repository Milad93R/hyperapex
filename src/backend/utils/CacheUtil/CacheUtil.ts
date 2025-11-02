import { NextResponse } from 'next/server'

/**
 * Cache duration presets in seconds
 */
export const CACHE_PRESETS = {
  /** Short cache for frequently changing data (1 minute) */
  SHORT: 60,
  /** Medium cache for moderately changing data (5 minutes) */
  MEDIUM: 300,
  /** Long cache for rarely changing data (1 hour) */
  LONG: 3600,
  /** Very long cache for almost static data (1 day) */
  VERY_LONG: 86400,
  /** Immutable cache for static assets (1 year) */
  IMMUTABLE: 31536000,
} as const

/**
 * Cache configuration for different endpoint types
 */
export const CACHE_CONFIG = {
  /** API documentation (swagger/docs) */
  DOCS: {
    maxAge: CACHE_PRESETS.LONG,
    staleWhileRevalidate: CACHE_PRESETS.VERY_LONG,
  },
  /** OpenAPI specification */
  OPENAPI: {
    maxAge: CACHE_PRESETS.LONG,
    staleWhileRevalidate: CACHE_PRESETS.VERY_LONG,
  },
  /** General API endpoints */
  API: {
    maxAge: CACHE_PRESETS.SHORT,
    staleWhileRevalidate: CACHE_PRESETS.MEDIUM,
  },
  /** Health check endpoints */
  HEALTH: {
    maxAge: 30,
    staleWhileRevalidate: CACHE_PRESETS.SHORT,
  },
  /** Static assets */
  STATIC: {
    maxAge: CACHE_PRESETS.IMMUTABLE,
    immutable: true,
  },
  /** No cache (for dynamic endpoints) */
  NO_CACHE: {
    noCache: true,
  },
} as const

/**
 * Cache utility for setting HTTP cache headers
 */
export class CacheUtil {
  /**
   * Create cache headers string
   */
  static createCacheHeader(config: {
    maxAge?: number
    staleWhileRevalidate?: number
    immutable?: boolean
    noCache?: boolean
    private?: boolean
  }): string {
    if (config.noCache) {
      return 'no-cache, no-store, must-revalidate'
    }

    if (config.private) {
      const parts = [`private, max-age=${config.maxAge || 0}`]
      if (config.staleWhileRevalidate) {
        parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`)
      }
      return parts.join(', ')
    }

    const parts: string[] = []
    parts.push('public')
    
    if (config.maxAge !== undefined) {
      parts.push(`max-age=${config.maxAge}`)
    }

    if (config.staleWhileRevalidate) {
      parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`)
    }

    if (config.immutable) {
      parts.push('immutable')
    }

    return parts.join(', ')
  }

  /**
   * Add cache headers to NextResponse
   */
  static addCacheHeaders(
    response: NextResponse,
    config: {
      maxAge?: number
      staleWhileRevalidate?: number
      immutable?: boolean
      noCache?: boolean
      private?: boolean
    }
  ): NextResponse {
    const cacheHeader = this.createCacheHeader(config)
    response.headers.set('Cache-Control', cacheHeader)
    return response
  }

  /**
   * Create a cached JSON response
   */
  static cachedJsonResponse(
    data: unknown,
    cacheType: keyof typeof CACHE_CONFIG = 'API'
  ): NextResponse {
    const cacheConfig = CACHE_CONFIG[cacheType]
    const response = NextResponse.json(data)
    
    if ('noCache' in cacheConfig && cacheConfig.noCache) {
      return this.addCacheHeaders(response, { noCache: true })
    }

    return this.addCacheHeaders(response, cacheConfig)
  }

  /**
   * Create a cached HTML response
   */
  static cachedHtmlResponse(
    html: string,
    cacheType: keyof typeof CACHE_CONFIG = 'API'
  ): NextResponse {
    const cacheConfig = CACHE_CONFIG[cacheType]
    const response = new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

    if ('noCache' in cacheConfig && cacheConfig.noCache) {
      return this.addCacheHeaders(response, { noCache: true })
    }

    return this.addCacheHeaders(response, cacheConfig)
  }

  /**
   * Create custom cache headers
   */
  static customCache(
    maxAge: number,
    staleWhileRevalidate?: number,
    immutable = false
  ): string {
    return this.createCacheHeader({
      maxAge,
      staleWhileRevalidate,
      immutable,
    })
  }
}

