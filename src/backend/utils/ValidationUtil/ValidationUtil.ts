/**
 * Input validation and sanitization utilities
 */

export interface ValidationError {
  field: string
  message: string
}

/**
 * Sanitize string input - removes leading/trailing whitespace and dangerous characters
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string')
  }

  return input.trim().replace(/[\x00-\x1F\x7F]/g, '')
}

/**
 * Validate and sanitize string input
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
  }
): { isValid: boolean; sanitized?: string; error?: ValidationError } {
  const { required = true, minLength, maxLength, pattern } = options || {}

  // Check if required
  if (required && (value === undefined || value === null || value === '')) {
    return {
      isValid: false,
      error: {
        field: fieldName,
        message: `${fieldName} is required`,
      },
    }
  }

  // Allow empty if not required
  if (!required && (value === undefined || value === null || value === '')) {
    return { isValid: true, sanitized: '' }
  }

  // Must be string
  if (typeof value !== 'string') {
    return {
      isValid: false,
      error: {
        field: fieldName,
        message: `${fieldName} must be a string`,
      },
    }
  }

  // Sanitize
  const sanitized = sanitizeString(value)

  // Check min length
  if (minLength !== undefined && sanitized.length < minLength) {
    return {
      isValid: false,
      error: {
        field: fieldName,
        message: `${fieldName} must be at least ${minLength} characters`,
      },
    }
  }

  // Check max length
  if (maxLength !== undefined && sanitized.length > maxLength) {
    return {
      isValid: false,
      error: {
        field: fieldName,
        message: `${fieldName} must be no more than ${maxLength} characters`,
      },
    }
  }

  // Check pattern
  if (pattern && !pattern.test(sanitized)) {
    return {
      isValid: false,
      error: {
        field: fieldName,
        message: `${fieldName} does not match required format`,
      },
    }
  }

  return { isValid: true, sanitized }
}

/**
 * Validate email format
 */
export function validateEmail(email: unknown): {
  isValid: boolean
  sanitized?: string
  error?: ValidationError
} {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return validateString(email, 'email', {
    required: true,
    pattern: emailPattern,
  })
}

/**
 * Validate URL format
 */
export function validateUrl(url: unknown): {
  isValid: boolean
  sanitized?: string
  error?: ValidationError
} {
  try {
    if (typeof url !== 'string') {
      return {
        isValid: false,
        error: { field: 'url', message: 'URL must be a string' },
      }
    }

    const sanitized = sanitizeString(url)
    new URL(sanitized) // Will throw if invalid

    return { isValid: true, sanitized }
  } catch {
    return {
      isValid: false,
      error: { field: 'url', message: 'Invalid URL format' },
    }
  }
}

/**
 * Sanitize object - removes undefined, null, and sanitizes strings
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const sanitized: Partial<T> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T]
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value
    }
  }

  return sanitized
}

/**
 * Validate request body
 */
export async function validateRequestBody<T>(
  request: Request
): Promise<{ data: T; error: null } | { data: null; error: ValidationError }> {
  try {
    const body = await request.json()

    if (!body || typeof body !== 'object') {
      return {
        data: null,
        error: {
          field: 'body',
          message: 'Request body must be a valid JSON object',
        },
      }
    }

    return { data: body as T, error: null }
  } catch (error) {
    return {
      data: null,
      error: {
        field: 'body',
        message: 'Invalid JSON in request body',
      },
    }
  }
}

