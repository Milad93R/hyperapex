/**
 * Calculation Service
 * Handles various mathematical and computational operations
 * 
 * Note: CPU-intensive calculations count towards Edge CPU Duration on Vercel.
 * For heavy calculations, consider using Node.js runtime instead of Edge.
 */
export class CalculationService {
  /**
   * Perform basic arithmetic operations
   */
  static calculate(operation: string, a: number, b: number): number {
    switch (operation.toLowerCase()) {
      case 'add':
      case '+':
        return a + b
      case 'subtract':
      case '-':
        return a - b
      case 'multiply':
      case '*':
        return a * b
      case 'divide':
      case '/':
        if (b === 0) throw new Error('Division by zero is not allowed')
        return a / b
      case 'power':
      case '^':
        return Math.pow(a, b)
      case 'modulo':
      case '%':
        if (b === 0) throw new Error('Modulo by zero is not allowed')
        return a % b
      default:
        throw new Error(`Unsupported operation: ${operation}`)
    }
  }

  /**
   * Perform multiple operations in sequence
   */
  static calculateSequence(operations: Array<{ operation: string; value: number }>, initialValue: number): number {
    let result = initialValue
    for (const op of operations) {
      result = this.calculate(op.operation, result, op.value)
    }
    return result
  }

  /**
   * Calculate factorial (CPU-intensive for large numbers)
   * Uses iterative multiplication with overflow protection
   * Automatically uses intensive mode for larger values
   */
  static factorial(n: number, intensive: boolean = false): number {
    if (n < 0) throw new Error('Factorial is not defined for negative numbers')
    if (!Number.isInteger(n)) throw new Error('Factorial requires an integer')
    if (n === 0 || n === 1) return 1
    if (n > 170) throw new Error('Factorial too large (max 170 to prevent overflow)')
    
    // For larger n or if intensive is requested, use intensive mode
    if (intensive || n > 50) {
      const iterations = Math.max(1000, n * 10)
      return this.factorialIntensive(n, iterations)
    }
    
    // Use BigInt for very large numbers to ensure accuracy
    let result = BigInt(1)
    for (let i = 2; i <= n; i++) {
      result *= BigInt(i)
    }
    // Convert back to number (approximation for very large values)
    return Number(result)
  }

  /**
   * Calculate factorial with multiple iterations (very CPU-intensive)
   */
  static factorialIntensive(n: number, iterations: number = 1000): number {
    if (n < 0) throw new Error('Factorial is not defined for negative numbers')
    if (!Number.isInteger(n)) throw new Error('Factorial requires an integer')
    if (n > 170) throw new Error('Factorial too large (max 170)')
    
    let finalResult = 1
    // Repeat calculation multiple times to increase CPU time
    for (let iter = 0; iter < iterations; iter++) {
      let result = BigInt(1)
      for (let i = 2; i <= n; i++) {
        result *= BigInt(i)
      }
      finalResult = Number(result)
    }
    return finalResult
  }

  /**
   * Calculate Fibonacci number (CPU-intensive for large indices)
   * Uses iterative approach with multiple passes for larger values
   */
  static fibonacci(n: number, intensive: boolean = false): number {
    if (n < 0) throw new Error('Fibonacci requires non-negative index')
    if (!Number.isInteger(n)) throw new Error('Fibonacci requires an integer')
    if (n === 0) return 0
    if (n === 1) return 1
    
    // For large numbers or intensive mode, use multiple passes
    const passes = intensive || n > 1000 
      ? Math.max(100, Math.floor(n / 10)) // Much more passes
      : Math.max(1, Math.floor(n / 100))  // Standard passes
    
    let result = 0
    for (let pass = 0; pass < passes; pass++) {
      let a = 0
      let b = 1
      for (let i = 2; i <= n; i++) {
        const temp = a + b
        a = b
        b = temp
      }
      result = b
    }
    return result
  }

  /**
   * Calculate Fibonacci sequence (CPU-intensive)
   */
  static fibonacciSequence(n: number): number[] {
    if (n < 0) throw new Error('Fibonacci requires non-negative index')
    if (!Number.isInteger(n)) throw new Error('Fibonacci requires an integer')
    
    const sequence: number[] = [0]
    if (n === 0) return sequence
    
    sequence.push(1)
    if (n === 1) return sequence
    
    for (let i = 2; i <= n; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2])
    }
    return sequence
  }

  /**
   * Calculate prime numbers up to a limit (CPU-intensive)
   * Uses Sieve of Eratosthenes with multiple passes for heavy computation
   */
  static getPrimes(limit: number, intensive: boolean = false): number[] {
    if (limit < 2) return []
    if (!Number.isInteger(limit)) throw new Error('Limit must be an integer')
    if (limit > 1000000) throw new Error('Limit too large (max 1,000,000 to prevent timeout)')
    
    // Use multiple passes to increase CPU time
    // More passes for intensive mode or larger limits
    const passes = intensive || limit > 10000
      ? Math.max(10, Math.floor(limit / 5000))  // Much more passes
      : Math.max(1, Math.floor(limit / 10000))   // Standard passes
    
    let finalPrimes: number[] = []
    
    for (let pass = 0; pass < passes; pass++) {
      const primes: number[] = []
      const sieve = new Array(limit + 1).fill(true)
      sieve[0] = false
      sieve[1] = false
      
      for (let i = 2; i <= Math.sqrt(limit); i++) {
        if (sieve[i]) {
          for (let j = i * i; j <= limit; j += i) {
            sieve[j] = false
          }
        }
      }
      
      for (let i = 2; i <= limit; i++) {
        if (sieve[i]) {
          primes.push(i)
        }
      }
      
      finalPrimes = primes
    }
    
    return finalPrimes
  }

  /**
   * Calculate statistical measures (enhanced with more computations)
   */
  static statistics(numbers: number[]): {
    sum: number
    average: number
    min: number
    max: number
    count: number
    median: number
    stdDev: number
    variance: number
    mode?: number
  } {
    if (numbers.length === 0) {
      throw new Error('Cannot calculate statistics for empty array')
    }

    // Expand array if too small for intensive computation
    const expandedNumbers = numbers.length < 1000 
      ? [...numbers, ...numbers.map(n => n * 1.1), ...numbers.map(n => n * 0.9)]
      : numbers

    // Multiple sort passes for CPU intensity
    let sorted = [...expandedNumbers]
    for (let i = 0; i < 3; i++) {
      sorted = [...sorted].sort((a, b) => a - b)
    }

    const sum = expandedNumbers.reduce((acc, val) => acc + val, 0)
    const count = expandedNumbers.length
    const average = sum / count
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    
    // Calculate variance and standard deviation (CPU-intensive)
    const variance = expandedNumbers.reduce((acc, val) => {
      const diff = val - average
      return acc + diff * diff
    }, 0) / count
    const stdDev = Math.sqrt(variance)
    
    // Calculate median
    let median: number
    if (sorted.length % 2 === 0) {
      median = (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    } else {
      median = sorted[Math.floor(sorted.length / 2)]
    }

    // Calculate mode (most frequent number)
    const frequency = new Map<number, number>()
    for (const num of expandedNumbers) {
      frequency.set(num, (frequency.get(num) || 0) + 1)
    }
    let maxFreq = 0
    let mode: number | undefined
    for (const [num, freq] of frequency.entries()) {
      if (freq > maxFreq) {
        maxFreq = freq
        mode = num
      }
    }

    return {
      sum,
      average,
      min,
      max,
      count: expandedNumbers.length,
      median,
      stdDev,
      variance,
      mode: maxFreq > 1 ? mode : undefined,
    }
  }

  /**
   * Calculate percentage
   */
  static percentage(part: number, total: number): number {
    if (total === 0) throw new Error('Total cannot be zero for percentage calculation')
    return (part / total) * 100
  }

  /**
   * Calculate compound interest
   */
  static compoundInterest(
    principal: number,
    rate: number,
    time: number,
    compoundingFrequency: number = 12
  ): {
    amount: number
    interest: number
  } {
    const amount = principal * Math.pow(1 + rate / (compoundingFrequency * 100), compoundingFrequency * time)
    return {
      amount,
      interest: amount - principal,
    }
  }

  /**
   * Evaluate a mathematical expression (simple parser)
   * Supports: +, -, *, /, ^, parentheses
   */
  static evaluateExpression(expression: string): number {
    // Remove whitespace
    const cleanExpr = expression.replace(/\s/g, '')
    
    // Validate expression contains only allowed characters
    if (!/^[0-9+\-*/().^\s]+$/.test(cleanExpr)) {
      throw new Error('Expression contains invalid characters')
    }

    try {
      // Use Function constructor for safe evaluation (only numbers and operators)
      // This is safe because we've validated the input
      const result = Function(`"use strict"; return (${cleanExpr})`)()
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Expression evaluation resulted in invalid number')
      }
      
      return result
    } catch (error) {
      throw new Error(`Invalid expression: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Matrix multiplication (very CPU-intensive)
   */
  static matrixMultiply(matrixA: number[][], matrixB: number[][]): number[][] {
    const rowsA = matrixA.length
    const colsA = matrixA[0].length
    const rowsB = matrixB.length
    const colsB = matrixB[0].length

    if (colsA !== rowsB) {
      throw new Error('Matrix dimensions are incompatible for multiplication')
    }

    const result: number[][] = []
    for (let i = 0; i < rowsA; i++) {
      result[i] = []
      for (let j = 0; j < colsB; j++) {
        let sum = 0
        for (let k = 0; k < colsA; k++) {
          sum += matrixA[i][k] * matrixB[k][j]
        }
        result[i][j] = sum
      }
    }

    return result
  }

  /**
   * Calculate large number of prime factors (CPU-intensive)
   */
  static primeFactors(n: number): number[] {
    if (n < 2) return []
    if (!Number.isInteger(n)) throw new Error('Number must be an integer')
    
    const factors: number[] = []
    let num = Math.abs(n)
    
    // Check for 2
    while (num % 2 === 0) {
      factors.push(2)
      num /= 2
    }
    
    // Check for odd numbers
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      while (num % i === 0) {
        factors.push(i)
        num /= i
      }
    }
    
    if (num > 2) {
      factors.push(num)
    }
    
    return factors
  }

  /**
   * Calculate PI using Monte Carlo method (CPU-intensive)
   */
  static calculatePiMonteCarlo(iterations: number = 1000000): number {
    if (!Number.isInteger(iterations) || iterations < 1) {
      throw new Error('Iterations must be a positive integer')
    }
    if (iterations > 10000000) {
      throw new Error('Iterations too large (max 10,000,000)')
    }

    let insideCircle = 0
    
    for (let i = 0; i < iterations; i++) {
      const x = Math.random()
      const y = Math.random()
      const distance = Math.sqrt(x * x + y * y)
      if (distance <= 1) {
        insideCircle++
      }
    }

    return (4 * insideCircle) / iterations
  }

  /**
   * Bubble sort (inefficient, CPU-intensive for large arrays)
   */
  static bubbleSort(numbers: number[]): number[] {
    const arr = [...numbers]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }

    return arr
  }

  /**
   * Calculate asset rows and released PnL from fill data
   * @param fills Array of fill data objects
   * @param count Number of items to calculate released PnL from
   * @param currentPrices Optional: Current prices from Binance for unrealized PnL calculation
   * @returns Object with released PnL, unrealized PnL, and asset positions
   */
  static assetRowsCalculate(
    fills: Array<{
      coin: string
      closedPnl: string | number
      dir: string
      sz: string | number
      side: 'A' | 'B'
      startPosition: string | number
      px?: string | number
      fee?: string | number
    }>,
    count: number,
    currentPrices?: Record<string, number>,
    priceTimestamps?: Record<string, number>
  ): {
    releasedPnl: number
    unrealizedPnl: number
    assets: Record<string, { position: number; price: number; value: number; currentPrice?: number; currentPriceTimestamp?: number; unrealizedPnl?: number }>
    totalAssets: number
    totalValue: number
    totalUnrealizedPnl: number
  } {
    if (!Array.isArray(fills) || fills.length === 0) {
      throw new Error('Fills array is required and must not be empty')
    }

    if (!Number.isInteger(count) || count < 1) {
      throw new Error('Count must be a positive integer')
    }

    // Calculate released PnL from first N items (including fees)
    const firstNItems = fills.slice(0, count)
    const releasedPnl = firstNItems.reduce((sum, fill) => {
      const pnl = typeof fill.closedPnl === 'string' ? parseFloat(fill.closedPnl) : fill.closedPnl
      const fee = fill.fee !== undefined 
        ? (typeof fill.fee === 'string' ? parseFloat(fill.fee) : fill.fee)
        : 0
      // Released PnL = closed PnL - fees
      return sum + (isNaN(pnl) ? 0 : pnl) - (isNaN(fee) ? 0 : fee)
    }, 0)

    // Calculate assets after first N items (using count parameter)
    const firstNItemsForAssets = fills.slice(0, count)
    const assets: Record<string, number> = {}
    const prices: Record<string, number> = {} // Track latest price for each coin

    firstNItemsForAssets.forEach((fill) => {
      const coin = fill.coin
      const size = typeof fill.sz === 'string' ? parseFloat(fill.sz) : fill.sz
      const startPos = typeof fill.startPosition === 'string' 
        ? parseFloat(fill.startPosition) 
        : fill.startPosition
      const price = fill.px !== undefined 
        ? (typeof fill.px === 'string' ? parseFloat(fill.px) : fill.px)
        : 0

      // Track latest price for this coin
      if (!isNaN(price) && price > 0) {
        prices[coin] = price
      }

      if (!assets[coin]) {
        // Initialize with startPosition
        assets[coin] = isNaN(startPos) ? 0 : startPos
      }

      // Update position based on direction and side
      if (fill.dir.includes('Open') || fill.dir.includes('Long')) {
        if (fill.side === 'B') {
          // Buy/Long
          assets[coin] += isNaN(size) ? 0 : size
        } else {
          // Sell/Short
          assets[coin] -= isNaN(size) ? 0 : size
        }
      } else if (fill.dir.includes('Close')) {
        // Closing position - adjust based on side
        if (fill.side === 'A') {
          // Closing long
          assets[coin] -= isNaN(size) ? 0 : size
        } else {
          // Closing short
          assets[coin] += isNaN(size) ? 0 : size
        }
      } else if (fill.dir.includes('Short') || fill.dir.includes('>')) {
        // Position switch
        if (fill.side === 'A') {
          assets[coin] -= isNaN(size) ? 0 : size
        } else {
          assets[coin] += isNaN(size) ? 0 : size
        }
      }
    })

    // Filter out assets with zero or near-zero positions and calculate values
    const filteredAssets: Record<string, { position: number; price: number; value: number; currentPrice?: number; currentPriceTimestamp?: number; unrealizedPnl?: number }> = {}
    let totalValue = 0
    let totalUnrealizedPnl = 0

    Object.entries(assets).forEach(([coin, position]) => {
      if (Math.abs(position) > 0.0001) {
        const entryPrice = prices[coin] || 0
        const value = Math.abs(position) * entryPrice // Use absolute value for total
        totalValue += value

        const assetData: { position: number; price: number; value: number; currentPrice?: number; currentPriceTimestamp?: number; unrealizedPnl?: number } = {
          position: parseFloat(position.toFixed(8)),
          price: parseFloat(entryPrice.toFixed(8)),
          value: parseFloat(value.toFixed(2)),
        }

        // Calculate unrealized PnL if current prices are provided
        if (currentPrices && currentPrices[coin] && currentPrices[coin] > 0) {
          const currentPrice = currentPrices[coin]
          assetData.currentPrice = parseFloat(currentPrice.toFixed(8))
          
          // Store timestamp if available
          if (priceTimestamps && priceTimestamps[coin]) {
            assetData.currentPriceTimestamp = priceTimestamps[coin]
          }
          
          // Unrealized PnL = (current_price - entry_price) * position
          // For long positions (positive): (current - entry) * position
          // For short positions (negative): (entry - current) * position
          const unrealizedPnl = (currentPrice - entryPrice) * position
          assetData.unrealizedPnl = parseFloat(unrealizedPnl.toFixed(8))
          totalUnrealizedPnl += unrealizedPnl
        }

        filteredAssets[coin] = assetData
      }
    })

    // Calculate total number of unique assets
    const totalAssets = Object.keys(filteredAssets).length

    return {
      releasedPnl: parseFloat(releasedPnl.toFixed(8)),
      unrealizedPnl: parseFloat(totalUnrealizedPnl.toFixed(8)),
      assets: filteredAssets,
      totalAssets,
      totalValue: parseFloat(totalValue.toFixed(2)),
      totalUnrealizedPnl: parseFloat(totalUnrealizedPnl.toFixed(8)),
    }
  }
}

