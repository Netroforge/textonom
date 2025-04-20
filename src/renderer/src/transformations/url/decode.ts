import type { TransformationFunction } from '../../types'

/**
 * Decodes URL-encoded text
 */
const urlDecode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return decodeURIComponent(text)
  } catch (error) {
    console.error('Error URL decoding:', error)
    throw new Error('Failed to URL decode text')
  }
}

export default urlDecode
