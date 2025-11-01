/**
 * Telegram configuration
 * Configure your Telegram group ID and thread IDs
 */
export const TELEGRAM_CONFIG = {
  groupId: process.env.TELEGRAM_GROUP_ID?.trim() || '',
  defaultThread: parseInt(process.env.TELEGRAM_DEFAULT_THREAD || '2', 10),
  threads: {
    default: parseInt(process.env.TELEGRAM_DEFAULT_THREAD || '2', 10),
    other: parseInt(process.env.TELEGRAM_OTHER_THREAD || '5', 10),
  },
} as const

/**
 * Thread IDs for easy access
 */
export const TELEGRAM_THREADS = {
  DEFAULT: parseInt(process.env.TELEGRAM_DEFAULT_THREAD || '2', 10),
  OTHER: parseInt(process.env.TELEGRAM_OTHER_THREAD || '5', 10),
} as const

