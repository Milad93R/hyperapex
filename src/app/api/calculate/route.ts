import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedHandler } from '@/backend'
import { validateRequestBody } from '@/backend'
import { isDebugMode, DebugLogCapture } from '@/backend'
import { withRequestMonitoring } from '@/backend/middleware/RequestMonitoring'
import { withErrorHandler } from '@/backend/handlers'
import { CalculationService } from '@/backend/services/CalculationService'

// Use Node.js runtime for CPU-intensive calculations
export const runtime = 'nodejs'

/**
 * Calculation API endpoint
 * Access at: http://localhost:3168/api/calculate
 * Requires API Key authentication
 * 
 * Supports various calculation types:
 * - Basic arithmetic (add, subtract, multiply, divide, power, modulo)
 * - Factorial
 * - Fibonacci
 * - Prime numbers
 * - Statistics (sum, average, min, max, median)
 * - Percentage
 * - Compound interest
 * - Expression evaluation
 */
export const POST = createAuthenticatedHandler(
  withRequestMonitoring(
    withErrorHandler(async (request: NextRequest) => {
      const debugMode = isDebugMode(request)
      const logCapture = new DebugLogCapture(debugMode)

      try {
        // Validate request body
        const validation = await validateRequestBody<{
          type: 'basic' | 'factorial' | 'fibonacci' | 'primes' | 'statistics' | 'percentage' | 'compound-interest' | 'expression' | 'sequence' | 'monte-carlo-pi' | 'matrix-multiply' | 'prime-factors' | 'bubble-sort' | 'assetrowscalculate'
          operation?: string
          a?: number
          b?: number
          n?: number
          numbers?: number[]
          limit?: number
          part?: number
          total?: number
          principal?: number
          rate?: number
          time?: number
          compoundingFrequency?: number
          expression?: string
          initialValue?: number
          operations?: Array<{ operation: string; value: number }>
          intensive?: boolean
          iterations?: number
          matrixA?: number[][]
          matrixB?: number[][]
          fills?: Array<{
            coin: string
            closedPnl: string | number
            dir: string
            sz: string | number
            side: 'A' | 'B'
            startPosition: string | number
            px?: string | number
            fee?: string | number
          }>
          count?: number
          currentPrices?: Record<string, number>
          priceTimestamps?: Record<string, number>
        }>(request)

        if (validation.error) {
          return NextResponse.json(
            {
              error: 'Validation failed',
              details: validation.error,
            },
            { status: 400 }
          )
        }

        const { type, ...params } = validation.data
        const startTime = performance.now()

        let result: unknown
        const calculationType = type

        // Perform calculation based on type
        switch (type) {
          case 'basic': {
            if (params.a === undefined || params.b === undefined || !params.operation) {
              return NextResponse.json(
                { error: 'Missing required parameters: a, b, operation' },
                { status: 400 }
              )
            }
            result = CalculationService.calculate(params.operation, params.a, params.b)
            break
          }

          case 'sequence': {
            if (params.initialValue === undefined || !params.operations) {
              return NextResponse.json(
                { error: 'Missing required parameters: initialValue, operations' },
                { status: 400 }
              )
            }
            result = CalculationService.calculateSequence(params.operations, params.initialValue)
            break
          }

          case 'factorial': {
            if (params.n === undefined) {
              return NextResponse.json(
                { error: 'Missing required parameter: n' },
                { status: 400 }
              )
            }
            result = CalculationService.factorial(params.n, params.intensive || false)
            break
          }

          case 'fibonacci': {
            if (params.n === undefined) {
              return NextResponse.json(
                { error: 'Missing required parameter: n' },
                { status: 400 }
              )
            }
            result = CalculationService.fibonacci(params.n, params.intensive || false)
            break
          }

          case 'primes': {
            if (params.limit === undefined) {
              return NextResponse.json(
                { error: 'Missing required parameter: limit' },
                { status: 400 }
              )
            }
            result = CalculationService.getPrimes(params.limit, params.intensive || false)
            break
          }

          case 'statistics': {
            if (!params.numbers || params.numbers.length === 0) {
              return NextResponse.json(
                { error: 'Missing required parameter: numbers (non-empty array)' },
                { status: 400 }
              )
            }
            result = CalculationService.statistics(params.numbers)
            break
          }

          case 'percentage': {
            if (params.part === undefined || params.total === undefined) {
              return NextResponse.json(
                { error: 'Missing required parameters: part, total' },
                { status: 400 }
              )
            }
            result = CalculationService.percentage(params.part, params.total)
            break
          }

          case 'compound-interest': {
            if (
              params.principal === undefined ||
              params.rate === undefined ||
              params.time === undefined
            ) {
              return NextResponse.json(
                { error: 'Missing required parameters: principal, rate, time' },
                { status: 400 }
              )
            }
            result = CalculationService.compoundInterest(
              params.principal,
              params.rate,
              params.time,
              params.compoundingFrequency || 12
            )
            break
          }

          case 'expression': {
            if (!params.expression) {
              return NextResponse.json(
                { error: 'Missing required parameter: expression' },
                { status: 400 }
              )
            }
            result = CalculationService.evaluateExpression(params.expression)
            break
          }

          case 'monte-carlo-pi': {
            const iterations = params.iterations || 1000000
            result = CalculationService.calculatePiMonteCarlo(iterations)
            break
          }

          case 'matrix-multiply': {
            if (!params.matrixA || !params.matrixB) {
              return NextResponse.json(
                { error: 'Missing required parameters: matrixA, matrixB' },
                { status: 400 }
              )
            }
            result = CalculationService.matrixMultiply(params.matrixA, params.matrixB)
            break
          }

          case 'prime-factors': {
            if (params.n === undefined) {
              return NextResponse.json(
                { error: 'Missing required parameter: n' },
                { status: 400 }
              )
            }
            result = CalculationService.primeFactors(params.n)
            break
          }

          case 'bubble-sort': {
            if (!params.numbers || params.numbers.length === 0) {
              return NextResponse.json(
                { error: 'Missing required parameter: numbers (non-empty array)' },
                { status: 400 }
              )
            }
            result = CalculationService.bubbleSort(params.numbers)
            break
          }

          case 'assetrowscalculate': {
            if (!params.fills || !Array.isArray(params.fills) || params.fills.length === 0) {
              return NextResponse.json(
                { error: 'Missing required parameter: fills (non-empty array)' },
                { status: 400 }
              )
            }
            if (params.count === undefined || !Number.isInteger(params.count) || params.count < 1) {
              return NextResponse.json(
                { error: 'Missing or invalid required parameter: count (must be a positive integer)' },
                { status: 400 }
              )
            }
            result = CalculationService.assetRowsCalculate(
              params.fills,
              params.count,
              params.currentPrices,
              params.priceTimestamps
            )
            break
          }

          default:
            return NextResponse.json(
              {
                error: 'Invalid calculation type',
                validTypes: [
                  'basic',
                  'sequence',
                  'factorial',
                  'fibonacci',
                  'primes',
                  'statistics',
                  'percentage',
                  'compound-interest',
                  'expression',
                  'monte-carlo-pi',
                  'matrix-multiply',
                  'prime-factors',
                  'bubble-sort',
                  'assetrowscalculate',
                ],
              },
              { status: 400 }
            )
        }

        const duration = performance.now() - startTime

        const response = NextResponse.json({
          success: true,
          type: calculationType,
          result,
          duration: `${duration.toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
          ...(debugMode && {
            debug: {
              logs: logCapture.getLogs(),
              mode: 'enabled',
              input: params,
            },
          }),
        })

        return response
      } catch (error) {
        console.error('Error performing calculation:', error)

        return NextResponse.json(
          {
            error: 'Calculation error',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            ...(debugMode && {
              debug: {
                logs: logCapture.getLogs(),
                stack: error instanceof Error ? error.stack : undefined,
              },
            }),
          },
          { status: 500 }
        )
      } finally {
        logCapture.restore()
      }
    }, [])
  )
)

