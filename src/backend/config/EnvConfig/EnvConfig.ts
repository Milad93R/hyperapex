/**
 * Environment configuration with automatic trimming
 * Protects against hidden characters (\\r\\n) added by CLI tools
 */

export const envConfig = {
  // API Authentication
  get apiKey(): string | undefined {
    return process.env.API_KEY?.trim()
  },

  // Swagger UI Authentication
  get swaggerUsername(): string | undefined {
    return process.env.SWAGGER_USERNAME?.trim()
  },

  get swaggerPassword(): string | undefined {
    return process.env.SWAGGER_PASSWORD?.trim()
  },

  // Debug Secret
  get debugSecret(): string | undefined {
    return process.env.DEBUG_SECRET?.trim()
  },

  // Custom Domain (for OpenAPI servers)
  get customDomain(): string | undefined {
    return process.env.CUSTOM_DOMAIN?.trim()
  },

  // Telegram Bot Configuration
  get telegramBotToken(): string | undefined {
    return process.env.TELEGRAM_BOT_TOKEN?.trim()
  },

  get telegramGroupId(): string | undefined {
    return process.env.TELEGRAM_GROUP_ID?.trim()
  },

  get telegramDefaultThread(): number {
    return parseInt(process.env.TELEGRAM_DEFAULT_THREAD || '2', 10)
  },
}

/**
 * Validate that required environment variables are set
 */
export function validateEnvConfig(): void {
  const required = {
    API_KEY: envConfig.apiKey,
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}

