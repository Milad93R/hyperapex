import { TelegramService } from '../../services/TelegramService'

/**
 * Logger utility that logs to both console and Telegram (optional)
 */
class Logger {
  private telegramService: TelegramService | null = null

  constructor() {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || ''
    if (botToken) {
      this.telegramService = new TelegramService(botToken)
    }
  }

  /**
   * Log debug message (console only)
   */
  debug(message: string, ...args: unknown[]) {
    console.debug(`[DEBUG] ${message}`, ...args)
  }

  /**
   * Log info message (console + Telegram)
   */
  async info(message: string, ...args: unknown[]) {
    const fullMessage =
      args.length > 0 ? `${message} ${JSON.stringify(args)}` : message
    console.log(`[INFO] ${fullMessage}`)

    if (this.telegramService) {
      this.telegramService
        .logtelFormatted('INFO', fullMessage)
        .catch((err) => console.error('Failed to send Telegram log:', err))
    }
  }

  /**
   * Log warn message (console + Telegram)
   */
  async warn(message: string, ...args: unknown[]) {
    const fullMessage =
      args.length > 0 ? `${message} ${JSON.stringify(args)}` : message
    console.warn(`[WARN] ${fullMessage}`)

    if (this.telegramService) {
      this.telegramService
        .logtelFormatted('WARN', fullMessage)
        .catch((err) => console.error('Failed to send Telegram log:', err))
    }
  }

  /**
   * Log error message (console + Telegram)
   */
  async error(message: string, error?: Error | unknown, ...args: unknown[]) {
    const errorInfo =
      error instanceof Error
        ? `${error.message}\nStack: ${error.stack}`
        : error
        ? JSON.stringify(error)
        : ''
    const fullMessage = errorInfo ? `${message}\n${errorInfo}` : message
    console.error(`[ERROR] ${fullMessage}`, ...args)

    if (this.telegramService) {
      this.telegramService
        .logtelFormatted('ERROR', fullMessage)
        .catch((err) => console.error('Failed to send Telegram log:', err))
    }
  }

  /**
   * Log to Telegram only (without console)
   */
  async telegram(level: string, message: string, threads?: number[]) {
    if (this.telegramService) {
      await this.telegramService.logtelFormatted(level, message, threads)
    }
  }
}

// Export singleton instance
export const logger = new Logger()

