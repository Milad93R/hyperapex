import { envConfig } from '../EnvConfig'

/**
 * Get OpenAPI 3.0 specification with dynamic server URLs
 */
export function getOpenAPISpec(baseUrl?: string) {
  const customDomain = envConfig.customDomain
  const currentUrl = baseUrl || 'http://localhost:3168'

  // Build servers array with multiple URLs
  const servers = []

  // Add custom domain first if configured
  if (customDomain) {
    servers.push({
      url: `https://${customDomain}`,
      description: 'Custom Domain (Production)',
    })
  }

  // Add current/production server
  servers.push({
    url: currentUrl.includes('localhost') ? currentUrl : currentUrl.replace('http://', 'https://'),
    description: currentUrl.includes('localhost') ? 'Local Development' : 'Production Server',
  })

  // Add deployment server if different from production
  if (currentUrl.includes('vercel.app') && !currentUrl.includes(customDomain || '')) {
    servers.push({
      url: currentUrl.replace('http://', 'https://'),
      description: 'Deployment Server',
    })
  }

  // Always include localhost for development
  if (!currentUrl.includes('localhost')) {
    servers.push({
      url: 'http://localhost:3168',
      description: 'Local Development',
    })
  }

  return {
    openapi: '3.0.0',
    info: {
      title: 'Apex API',
      version: '1.0.0',
      description: 'Apex API Documentation - Production-ready REST API with authentication, validation, and comprehensive features',
      contact: {
        name: 'API Support',
      },
    },
    servers,
    tags: [
      { name: 'General', description: 'General informational endpoints' },
      { name: 'Examples', description: 'Example endpoints demonstrating features' },
      { name: 'Health', description: 'Health check and monitoring endpoints' },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for authentication. Required for most endpoints. Get your API key from environment variables.',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            authenticated: { type: 'boolean' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
        HealthStatus: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['OK', 'ERROR'] },
            timestamp: { type: 'string', format: 'date-time' },
            service: { type: 'string' },
          },
        },
        EchoRequest: {
          type: 'object',
          description: 'Any JSON object to echo back',
          additionalProperties: true,
        },
        EchoResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: { type: 'object', additionalProperties: true },
            source: { type: 'string' },
          },
        },
        ExampleRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name field' },
            email: { type: 'string', format: 'email', description: 'Email address' },
            message: { type: 'string', description: 'Message content' },
          },
        },
        ExampleResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object', additionalProperties: true },
            timestamp: { type: 'string', format: 'date-time' },
            authenticated: { type: 'boolean' },
            debug: {
              type: 'object',
              properties: {
                logs: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      level: { type: 'string' },
                      message: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
                mode: { type: 'string' },
                stack: { type: 'string' },
              },
            },
          },
        },
      },
    },
    paths: {
      '/api': {
        get: {
          summary: 'Get API status',
          description: 'Returns API status and information. Works without authentication but shows authentication status if API key is provided.',
          operationId: 'getApiStatus',
          tags: ['General'],
          parameters: [
            {
              name: 'X-API-Key',
              in: 'header',
              required: false,
              schema: { type: 'string' },
              description: 'API key for authentication (optional)',
            },
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ApiResponse',
                  },
                  example: {
                    message: 'Hello from Next.js API route!',
                    timestamp: '2025-11-01T10:00:00.000Z',
                    authenticated: false,
                    note: 'To authenticate, add header: X-API-Key: your-api-key-here',
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'POST to API',
          description: 'Example POST endpoint. Accepts any JSON data and returns it.',
          operationId: 'postToApi',
          tags: ['General'],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: true,
                },
                example: {
                  data: 'example data',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      receivedData: { type: 'object', additionalProperties: true },
                      timestamp: { type: 'string', format: 'date-time' },
                      authenticated: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Missing or invalid API key',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/api/health': {
        get: {
          summary: 'Health check',
          description: 'Returns the health status of the API service',
          operationId: 'healthCheck',
          tags: ['Health'],
          responses: {
            '200': {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HealthStatus',
                  },
                  example: {
                    status: 'OK',
                    timestamp: '2025-11-01T10:00:00.000Z',
                    service: 'Next.js API Routes',
                  },
                },
              },
            },
          },
        },
      },
      '/api/echo': {
        post: {
          summary: 'Echo endpoint',
          description: 'Echoes back the received JSON data. Useful for testing API connectivity.',
          operationId: 'echo',
          tags: ['Examples'],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EchoRequest',
                },
                example: {
                  test: 'data',
                  number: 123,
                  boolean: true,
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Echo response',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/EchoResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid JSON in request body',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/api/example': {
        post: {
          summary: 'Example authenticated endpoint',
          description:
            'Example endpoint demonstrating authentication, validation, sanitization, and debug mode. Supports X-Debug-Secret header for detailed logs.',
          operationId: 'example',
          tags: ['Examples'],
          security: [{ ApiKeyAuth: [] }],
          parameters: [
            {
              name: 'X-Debug-Secret',
              in: 'header',
              required: false,
              schema: { type: 'string' },
              description: 'Debug secret to enable detailed logging in response',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ExampleRequest',
                },
                example: {
                  name: 'John Doe',
                  email: 'john@example.com',
                  message: 'Hello from API',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ExampleResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationError',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
    },
  }
}

