import type { TransformationFunction } from '../../types'

/**
 * Converts text to camelCase
 * @param text - The text to convert
 * @returns The text in camelCase
 */
const toCamelCase: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Replace spaces, underscores, and hyphens with spaces
    // Then capitalize each word except the first one
    const camelCase = text
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/[\s_-]+(.)/g, (_, c) => c.toUpperCase()) // Convert spaces, underscores, and hyphens to camelCase
      .replace(/^([A-Z])/, (_, c) => c.toLowerCase()) // Ensure first character is lowercase

    return camelCase
  } catch (error) {
    console.error('Error converting to camelCase:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to convert to camelCase: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to convert to camelCase: ${error}`)
    } else {
      throw new Error('Failed to convert to camelCase: Unknown error')
    }
  }
}

export default toCamelCase
