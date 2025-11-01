/**
 * Environment variable protection utility
 * Automatically trims environment variables to prevent hidden character issues
 */

/**
 * Safely get and trim environment variable
 * Prevents issues with \r\n characters added by CLI tools
 */
export function getEnv(key: string): string | undefined {
  const value = process.env[key]
  return value?.trim()
}

/**
 * Safely get and trim environment variable with default
 */
export function getEnvOrDefault(key: string, defaultValue: string): string {
  return getEnv(key) ?? defaultValue
}

/**
 * Get required environment variable (throws if missing)
 */
export function requireEnv(key: string): string {
  const value = getEnv(key)
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  return value
}

/**
 * Get boolean environment variable
 */
export function getEnvBoolean(key: string, defaultValue = false): boolean {
  const value = getEnv(key)?.toLowerCase()
  if (!value) return defaultValue
  return value === 'true' || value === '1' || value === 'yes'
}

/**
 * Get number environment variable
 */
export function getEnvNumber(key: string, defaultValue?: number): number | undefined {
  const value = getEnv(key)
  if (!value) return defaultValue
  const parsed = Number(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Validate multiple required environment variables
 */
export function validateRequiredEnv(keys: string[]): void {
  const missing = keys.filter((key) => !getEnv(key))
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

