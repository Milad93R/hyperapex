/**
 * Binance Service
 * Provides methods to interact with Binance API for price data
 */

const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3'

export interface BinanceKline {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteAssetVolume: string
  numberOfTrades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
  ignore: string
}

export class BinanceService {
  /**
   * Get current price for a symbol from Binance
   * Uses the latest 5-minute candle
   * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
   * @returns Current price as number
   */
  static async getCurrentPrice(symbol: string): Promise<number> {
    try {
      // Get the latest 5-minute candle
      const now = Date.now()
      const startTime = Math.floor((now - 5 * 60 * 1000) / (5 * 60 * 1000)) * (5 * 60 * 1000)
      const endTime = startTime + 5 * 60 * 1000 - 1

      const response = await fetch(
        `${BINANCE_API_BASE_URL}/klines?symbol=${symbol}&interval=5m&startTime=${startTime}&endTime=${endTime}&limit=1`
      )

      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No candle data returned from Binance')
      }

      // Binance klines format: [OpenTime, Open, High, Low, Close, Volume, ...]
      const closePrice = parseFloat(data[0][4]) // Close price is at index 4

      if (isNaN(closePrice) || closePrice <= 0) {
        throw new Error('Invalid price data from Binance')
      }

      return closePrice
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get Binance price: ${error.message}`)
      }
      throw new Error('Failed to get Binance price: Unknown error')
    }
  }

  /**
   * Get current prices for multiple symbols
   * @param symbols - Array of trading pair symbols
   * @returns Record of symbol to price
   */
  static async getCurrentPrices(symbols: string[]): Promise<Record<string, number>> {
    const prices: Record<string, number> = {}

    // Fetch prices in parallel
    const promises = symbols.map(async (symbol) => {
      try {
        const price = await this.getCurrentPrice(symbol)
        return { symbol, price }
      } catch (error) {
        console.error(`Failed to get price for ${symbol}:`, error)
        return { symbol, price: 0 }
      }
    })

    const results = await Promise.all(promises)

    results.forEach(({ symbol, price }) => {
      if (price > 0) {
        prices[symbol] = price
      }
    })

    return prices
  }
}

