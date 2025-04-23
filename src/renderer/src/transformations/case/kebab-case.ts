import type { TransformationFunction } from '../../types'

/**
 * Converts text to kebab-case
 * @param text - The text to convert
 * @returns The text in kebab-case
 */
const toKebabCase: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Replace spaces and special characters with hyphens
    // First, convert camelCase to kebab-case
    const withHyphens = text
      .replace(/([a-z])([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/[^\w-]/g, '') // Remove special characters
      .toLowerCase() // Convert to lowercase

    return withHyphens
  } catch (error) {
    console.error('Error converting to kebab-case:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to convert to kebab-case: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to convert to kebab-case: ${error}`)
    } else {
      throw new Error('Failed to convert to kebab-case: Unknown error')
    }
  }
}

export default toKebabCase
