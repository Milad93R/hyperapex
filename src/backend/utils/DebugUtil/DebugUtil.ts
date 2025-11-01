import { NextRequest } from 'next/server'
import { envConfig } from '../../config/EnvConfig'

/**
 * Debug utility for handling X-Debug-Secret header
 */

export interface CapturedLog {
  level: string
  message: string
  timestamp: string
}

/**
 * Check if debug mode is enabled based on X-Debug-Secret header
 */
export function isDebugMode(request: NextRequest): boolean {
  const debugSecret = envConfig.debugSecret
  const providedSecret = request.headers.get('X-Debug-Secret')

  return !!(debugSecret && providedSecret === debugSecret)
}

/**
 * Log capture utility for debug mode
 * Captures console logs when debug mode is enabled
 */
export class DebugLogCapture {
  private logs: CapturedLog[] = []
  private originalMethods: {
    log: typeof console.log
    error: typeof console.error
    warn: typeof console.warn
    info: typeof console.info
    debug: typeof console.debug
  }

  constructor(private enabled: boolean) {
    if (enabled) {
      this.originalMethods = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug,
      }

      this.captureLogs()
    }
  }

  private captureLogs() {
    console.log = (...args: unknown[]) => {
      this.logs.push({
        level: 'log',
        message: args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' '),
        timestamp: new Date().toISOString(),
      })
      this.originalMethods.log.apply(console, args)
    }

    console.error = (...args: unknown[]) => {
      this.logs.push({
        level: 'error',
        message: args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' '),
        timestamp: new Date().toISOString(),
      })
      this.originalMethods.error.apply(console, args)
    }

    console.warn = (...args: unknown[]) => {
      this.logs.push({
        level: 'warn',
        message: args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' '),
        timestamp: new Date().toISOString(),
      })
      this.originalMethods.warn.apply(console, args)
    }

    console.info = (...args: unknown[]) => {
      this.logs.push({
        level: 'info',
        message: args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' '),
        timestamp: new Date().toISOString(),
      })
      this.originalMethods.info.apply(console, args)
    }

    console.debug = (...args: unknown[]) => {
      this.logs.push({
        level: 'debug',
        message: args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' '),
        timestamp: new Date().toISOString(),
      })
      this.originalMethods.debug.apply(console, args)
    }
  }

  restore() {
    if (this.enabled) {
      console.log = this.originalMethods.log
      console.error = this.originalMethods.error
      console.warn = this.originalMethods.warn
      console.info = this.originalMethods.info
      console.debug = this.originalMethods.debug
    }
  }

  getLogs(): CapturedLog[] {
    return this.logs
  }
}

