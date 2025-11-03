import { envConfig } from '../EnvConfig'
import { SITE_CONFIG } from '@/config/constants'

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
      title: `${SITE_CONFIG.name} API`,
      version: '1.0.0',
      description: `${SITE_CONFIG.name} API Documentation - Production-ready REST API with authentication, validation, and comprehensive features`,
      contact: {
        name: 'API Support',
      },
    },
    servers,
    tags: [
      { name: 'General', description: 'General informational endpoints' },
      { name: 'Examples', description: 'Example endpoints demonstrating features' },
      { name: 'Health', description: 'Health check and monitoring endpoints' },
      { name: 'Telegram', description: 'Telegram messaging integration endpoints' },
      { name: 'Calculations', description: 'Mathematical and computational endpoints' },
      { name: 'Testing', description: 'Testing and utility endpoints' },
      { name: 'Supabase', description: 'Supabase database integration endpoints' },
      { name: 'Hyperinfo', description: 'Hyperliquid API wrapper endpoints' },
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
        TelegramMessageRequest: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              type: 'string',
              description: 'Message text to send to Telegram threads. HTML formatting supported.',
            },
            threads: {
              type: 'array',
              description: 'Additional thread IDs to send to. Default thread is always included automatically.',
              items: {
                type: 'integer',
              },
            },
          },
        },
        TelegramLogRequest: {
          type: 'object',
          required: ['message'],
          properties: {
            level: {
              type: 'string',
              description: 'Log level label (INFO, WARN, ERROR, etc.). Defaults to INFO.',
            },
            message: { type: 'string' },
            threads: {
              type: 'array',
              items: {
                type: 'integer',
              },
            },
          },
        },
        TelegramSendResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  thread: { type: 'integer' },
                  success: { type: 'boolean' },
                  error: { type: 'string' },
                },
              },
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        TelegramThreadsResponse: {
          type: 'object',
          properties: {
            threads: {
              type: 'object',
              properties: {
                DEFAULT: { type: 'integer' },
                OTHER: { type: 'integer' },
              },
            },
            description: {
              type: 'object',
              properties: {
                DEFAULT: { type: 'string' },
                OTHER: { type: 'string' },
              },
            },
            timestamp: { type: 'string', format: 'date-time' },
            authenticated: { type: 'boolean' },
          },
        },
        CalculationRequest: {
          type: 'object',
          required: ['type'],
          properties: {
            type: {
              type: 'string',
              enum: ['basic', 'factorial', 'fibonacci', 'primes', 'statistics', 'percentage', 'compound-interest', 'expression', 'sequence'],
              description: 'Type of calculation to perform',
            },
            operation: {
              type: 'string',
              description: 'Operation for basic calculations: add, subtract, multiply, divide, power, modulo',
            },
            a: { type: 'number', description: 'First number for basic calculations' },
            b: { type: 'number', description: 'Second number for basic calculations' },
            n: { type: 'number', description: 'Number for factorial or fibonacci' },
            numbers: {
              type: 'array',
              items: { type: 'number' },
              description: 'Array of numbers for statistics calculation',
            },
            limit: { type: 'number', description: 'Upper limit for prime number calculation' },
            part: { type: 'number', description: 'Part value for percentage calculation' },
            total: { type: 'number', description: 'Total value for percentage calculation' },
            principal: { type: 'number', description: 'Principal amount for compound interest' },
            rate: { type: 'number', description: 'Interest rate for compound interest' },
            time: { type: 'number', description: 'Time period for compound interest' },
            compoundingFrequency: { type: 'number', description: 'Compounding frequency per year (default: 12)' },
            expression: { type: 'string', description: 'Mathematical expression to evaluate' },
            initialValue: { type: 'number', description: 'Initial value for sequence calculation' },
            operations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  operation: { type: 'string' },
                  value: { type: 'number' },
                },
              },
              description: 'Operations to perform in sequence',
            },
          },
        },
        CalculationResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            type: { type: 'string' },
            result: {
              oneOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'object', additionalProperties: true },
              ],
              description: 'Calculation result',
            },
            duration: { type: 'string', description: 'Calculation duration in milliseconds' },
            timestamp: { type: 'string', format: 'date-time' },
            debug: {
              type: 'object',
              properties: {
                logs: { type: 'array' },
                mode: { type: 'string' },
                input: { type: 'object' },
              },
              description: 'Debug information (only when X-Debug-Secret header is provided)',
            },
          },
        },
        SupabaseTestResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            configured: { type: 'boolean' },
            supabaseUrl: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            note: { type: 'string' },
          },
        },
        HyperinfoRequest: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'Type of Hyperliquid API call',
            },
            user: {
              type: 'string',
              pattern: '^0x[a-fA-F0-9]{40}$',
              description: 'Ethereum address of the user (required for userNonFundingLedgerUpdates)',
            },
            startTime: {
              type: 'integer',
              description: 'Unix timestamp in milliseconds to start from (required for userNonFundingLedgerUpdates and userFillsByTime)',
              minimum: 1,
            },
            payload: {
              type: 'object',
              additionalProperties: true,
              description: 'Custom payload for generic API calls (required for custom type)',
            },
          },
        },
        HyperinfoResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            type: { type: 'string' },
            data: {
              type: 'object',
              additionalProperties: true,
              description: 'Response data from Hyperliquid API',
            },
            duration: { type: 'string', description: 'Request duration in milliseconds' },
            timestamp: { type: 'string', format: 'date-time' },
            debug: {
              type: 'object',
              properties: {
                logs: { type: 'array' },
                mode: { type: 'string' },
                input: { type: 'object' },
                stack: { type: 'string' },
              },
              description: 'Debug information (only when X-Debug-Secret header is provided)',
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
      '/api/debug-env': {
        get: {
          summary: 'Environment debug endpoint',
          description:
            'Debug endpoint that shows environment variable configuration status without exposing sensitive values. Useful for troubleshooting configuration issues.',
          operationId: 'debugEnv',
          tags: ['General'],
          responses: {
            '200': {
              description: 'Environment configuration status',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      environment: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                      requestInfo: {
                        type: 'object',
                        properties: {
                          method: { type: 'string' },
                          path: { type: 'string' },
                          ip: { type: 'string' },
                          userAgent: { type: 'string' },
                        },
                      },
                      configuration: {
                        type: 'object',
                        properties: {
                          hasApiKey: { type: 'boolean' },
                          apiKeyLength: { type: 'integer' },
                          hasSwaggerUsername: { type: 'boolean' },
                          swaggerUsernameLength: { type: 'integer' },
                          hasSwaggerPassword: { type: 'boolean' },
                          swaggerPasswordLength: { type: 'integer' },
                          hasDebugSecret: { type: 'boolean' },
                          debugSecretLength: { type: 'integer' },
                          hasCustomDomain: { type: 'boolean' },
                          customDomain: { type: 'string' },
                        },
                      },
                      characterAnalysis: {
                        type: 'object',
                        description: 'Character analysis to detect hidden characters',
                      },
                      tests: {
                        type: 'object',
                        description: 'Test comparisons for debugging',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/telegram/send': {
        post: {
          summary: 'Send Telegram message',
          description:
            'Sends a message to the configured Telegram group threads. Default thread is always included and additional threads can be specified.',
          operationId: 'sendTelegramMessage',
          tags: ['Telegram'],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TelegramMessageRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Message dispatch results',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TelegramSendResponse',
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
              description: 'Failed to send message',
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
      '/api/telegram/log': {
        post: {
          summary: 'Send formatted Telegram log',
          description:
            'Formats a log message with level and sends it to Telegram threads. Default thread is always included.',
          operationId: 'sendTelegramLog',
          tags: ['Telegram'],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TelegramLogRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Log dispatch results',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TelegramSendResponse',
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
              description: 'Failed to send log',
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
      '/api/telegram/threads': {
        get: {
          summary: 'List Telegram thread IDs',
          description: 'Returns the configured Telegram thread IDs and descriptions.',
          operationId: 'getTelegramThreads',
          tags: ['Telegram'],
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
              description: 'Thread information',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TelegramThreadsResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/api/calculate': {
        post: {
          summary: 'Perform calculations',
          description:
            'Performs various mathematical and computational operations. Uses Node.js runtime for CPU-intensive calculations. Supports basic arithmetic, factorial, fibonacci, prime numbers, statistics, percentage, compound interest, expression evaluation, and operation sequences.',
          operationId: 'calculate',
          tags: ['Calculations'],
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
                  $ref: '#/components/schemas/CalculationRequest',
                },
                examples: {
                  basic: {
                    summary: 'Basic arithmetic',
                    value: {
                      type: 'basic',
                      operation: 'multiply',
                      a: 42,
                      b: 7,
                    },
                  },
                  factorial: {
                    summary: 'Factorial',
                    value: {
                      type: 'factorial',
                      n: 10,
                    },
                  },
                  fibonacci: {
                    summary: 'Fibonacci',
                    value: {
                      type: 'fibonacci',
                      n: 20,
                    },
                  },
                  statistics: {
                    summary: 'Statistics',
                    value: {
                      type: 'statistics',
                      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    },
                  },
                  expression: {
                    summary: 'Expression evaluation',
                    value: {
                      type: 'expression',
                      expression: '(10 + 5) * 2 - 3',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Calculation successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CalculationResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Validation error or invalid calculation',
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
              description: 'Calculation error',
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
      '/api/sleep': {
        get: {
          summary: 'Sleep endpoint (GET)',
          description:
            'Sleeps for a specified duration. Useful for testing timeouts, long-running operations, and Vercel function duration limits. Defaults to 5 seconds.',
          operationId: 'sleepGet',
          tags: ['Testing'],
          security: [{ ApiKeyAuth: [] }],
          parameters: [
            {
              name: 'duration',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 5000, minimum: 0, maximum: 60000 },
              description: 'Sleep duration in milliseconds (default: 5000ms = 5 seconds, max: 60000ms = 60 seconds)',
            },
          ],
          responses: {
            '200': {
              description: 'Sleep completed successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      requestedDuration: { type: 'string' },
                      actualDuration: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid duration parameter',
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
        post: {
          summary: 'Sleep endpoint (POST)',
          description:
            'Sleeps for a specified duration. Useful for testing timeouts, long-running operations, and Vercel function duration limits. Defaults to 5 seconds.',
          operationId: 'sleepPost',
          tags: ['Testing'],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    duration: {
                      type: 'integer',
                      default: 5000,
                      minimum: 0,
                      maximum: 60000,
                      description: 'Sleep duration in milliseconds (default: 5000ms = 5 seconds, max: 60000ms = 60 seconds)',
                    },
                    message: {
                      type: 'string',
                      description: 'Custom message to return',
                    },
                  },
                },
                example: {
                  duration: 5000,
                  message: 'Slept successfully',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Sleep completed successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      requestedDuration: { type: 'string' },
                      actualDuration: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid duration or validation error',
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
      '/api/supabase/test': {
        get: {
          summary: 'Test Supabase connection',
          description:
            'Tests if Supabase is configured and ready to use. Returns connection status and configuration information.',
          operationId: 'testSupabase',
          tags: ['Supabase'],
          security: [{ ApiKeyAuth: [] }],
          responses: {
            '200': {
              description: 'Supabase is configured and ready',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SupabaseTestResponse',
                  },
                  example: {
                    success: true,
                    message: 'Supabase is configured and ready to use',
                    configured: true,
                    supabaseUrl: 'https://your-project.supabase.co',
                    timestamp: '2025-11-02T04:00:00.000Z',
                    note: 'You can now use SupabaseService to interact with your database',
                  },
                },
              },
            },
            '503': {
              description: 'Supabase is not configured',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SupabaseTestResponse',
                  },
                  example: {
                    success: false,
                    message: 'Supabase is not configured',
                    configured: false,
                    timestamp: '2025-11-02T04:00:00.000Z',
                    note: 'Please check your environment variables: SUPABASE_URL and SUPABASE_SERVICE_KEY',
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
      '/api/hyperinfo': {
        post: {
          summary: 'Hyperliquid API wrapper',
          description:
            'Wrapper for Hyperliquid API endpoints (https://api.hyperliquid.xyz/info). Provides access to Hyperliquid blockchain data including user ledger updates and other API calls.',
          operationId: 'hyperinfo',
          tags: ['Hyperinfo'],
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
                  $ref: '#/components/schemas/HyperinfoRequest',
                },
                examples: {
                  userLedgerUpdates: {
                    summary: 'User non-funding ledger updates',
                    description: 'Get ledger updates for a user starting from a specific timestamp',
                    value: {
                      type: 'userNonFundingLedgerUpdates',
                      user: '0xA13CF65c9fb9AFfFA991E8b371C5EE122F8ba537',
                      startTime: 1672531200000,
                    },
                  },
                  userFillsByTime: {
                    summary: 'User fills by time',
                    description: 'Get fill data for a user starting from a specific timestamp',
                    value: {
                      type: 'userFillsByTime',
                      user: '0xA13CF65c9fb9AFfFA991E8b371C5EE122F8ba537',
                      startTime: 1672531200000,
                    },
                  },
                  custom: {
                    summary: 'Custom API call',
                    description: 'Make a custom call to the Hyperliquid API',
                    value: {
                      type: 'custom',
                      payload: {
                        type: 'userNonFundingLedgerUpdates',
                        user: '0xA13CF65c9fb9AFfFA991E8b371C5EE122F8ba537',
                        startTime: 1672531200000,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Hyperliquid API call successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HyperinfoResponse',
                  },
                  example: {
                    success: true,
                    type: 'userNonFundingLedgerUpdates',
                    data: {
                      // Response from Hyperliquid API
                    },
                    duration: '123.45ms',
                    timestamp: '2025-11-03T10:00:00.000Z',
                  },
                },
              },
            },
            '400': {
              description: 'Validation error or invalid request',
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
              description: 'Hyperliquid API error',
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

