import type { TransformationFunction } from '../../types'

/**
 * Converts text to snake_case
 * @param text - The text to convert
 * @returns The text in snake_case
 */
const toSnakeCase: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Replace spaces and special characters with underscores
    // First, convert camelCase to snake_case
    const withUnderscores = text
      .replace(/([a-z])([A-Z])/g, '$1_$2') // Convert camelCase to snake_case
      .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscores
      .replace(/[^\w_]/g, '') // Remove special characters
      .toLowerCase() // Convert to lowercase

    return withUnderscores
  } catch (error) {
    console.error('Error converting to snake_case:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to convert to snake_case: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to convert to snake_case: ${error}`)
    } else {
      throw new Error('Failed to convert to snake_case: Unknown error')
    }
  }
}

export default toSnakeCase
