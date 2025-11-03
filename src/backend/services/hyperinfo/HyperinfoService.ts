/**
 * Hyperinfo Service
 * Wrapper for Hyperliquid API endpoints
 * 
 * Provides methods to interact with the Hyperliquid API (https://api.hyperliquid.xyz/info)
 */

const HYPERLIQUID_API_BASE_URL = 'https://api.hyperliquid.xyz/info'

export interface UserNonFundingLedgerUpdatesParams {
  type: 'userNonFundingLedgerUpdates'
  user: string // Ethereum address
  startTime: number // Unix timestamp in milliseconds
}

export interface HyperliquidApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export class HyperinfoService {
  /**
   * Call Hyperliquid API endpoint
   * Generic method to make POST requests to the Hyperliquid API
   */
  private static async callHyperliquidApi<T = unknown>(
    payload: Record<string, unknown>
  ): Promise<T> {
    try {
      const response = await fetch(HYPERLIQUID_API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Hyperliquid API error: ${response.status} ${response.statusText}. ${errorText}`
        )
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to call Hyperliquid API: ${error.message}`)
      }
      throw new Error('Failed to call Hyperliquid API: Unknown error')
    }
  }

  /**
   * Get user non-funding ledger updates
   * Fetches ledger updates for a specific user starting from a given timestamp
   * 
   * @param user - Ethereum address of the user
   * @param startTime - Unix timestamp in milliseconds to start from
   * @returns Ledger updates data
   */
  static async getUserNonFundingLedgerUpdates(
    user: string,
    startTime: number
  ): Promise<unknown> {
    // Validate Ethereum address format (basic check)
    if (!user || !user.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid Ethereum address format')
    }

    // Validate timestamp
    if (!Number.isInteger(startTime) || startTime <= 0) {
      throw new Error('Invalid startTime: must be a positive integer (Unix timestamp in milliseconds)')
    }

    const payload: UserNonFundingLedgerUpdatesParams = {
      type: 'userNonFundingLedgerUpdates',
      user,
      startTime,
    }

    return this.callHyperliquidApi(payload)
  }

  /**
   * Generic method to call any Hyperliquid API endpoint
   * Allows flexibility for future API types
   * 
   * @param payload - Payload to send to the API
   * @returns API response data
   */
  static async callApi<T = unknown>(payload: Record<string, unknown>): Promise<T> {
    return this.callHyperliquidApi<T>(payload)
  }
}

