import { NextRequest, NextResponse } from 'next/server'
import { envConfig } from '@/backend/config/env.config'

/**
 * OpenAPI 3.0 Specification endpoint
 * Access at: http://localhost:3168/openapi.json
 * Public endpoint - no authentication required
 */
export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin
  const customDomain = envConfig.customDomain

  const servers = [
    {
      url: customDomain ? `https://${customDomain}` : baseUrl,
      description: 'Production Server',
    },
    {
      url: baseUrl,
      description: 'Current Server',
    },
    {
      url: 'http://localhost:3168',
      description: 'Local Development',
    },
  ]

  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Apex API',
      version: '1.0.0',
      description: 'Apex API Documentation',
      contact: {
        name: 'API Support',
      },
    },
    servers,
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key for authentication',
        },
      },
    },
    paths: {
      '/api': {
        get: {
          summary: 'Get API status',
          description: 'Returns API status and information',
          tags: ['General'],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                      authenticated: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Missing or invalid API key',
            },
          },
        },
        post: {
          summary: 'POST to API',
          description: 'Example POST endpoint',
          tags: ['General'],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful response',
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
      },
      '/api/example': {
        post: {
          summary: 'Example authenticated endpoint',
          description: 'Example endpoint demonstrating authentication, validation, and debug mode',
          tags: ['Examples'],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful response',
            },
            '400': {
              description: 'Validation error',
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
      },
    },
  }

  return NextResponse.json(openApiSpec)
}

