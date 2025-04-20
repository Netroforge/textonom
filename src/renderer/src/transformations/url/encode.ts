import type { TransformationFunction } from '../../types'

/**
 * Encodes text for use in URLs
 */
const urlEncode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return encodeURIComponent(text)
  } catch (error) {
    console.error('Error URL encoding:', error)
    throw new Error('Failed to URL encode text')
  }
}

export default urlEncode
