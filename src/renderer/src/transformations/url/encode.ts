import type { TransformationFunction } from '../../types/transformation'

/**
 * Encodes text for use in URLs
 */
const urlEncode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return encodeURIComponent(text)
  } catch {
    throw new Error('Failed to URL encode text')
  }
}

export default urlEncode
