import type { TransformationFunction } from '../../types/transformation'

/**
 * Decodes URL-encoded text
 */
const urlDecode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return decodeURIComponent(text)
  } catch {
    throw new Error('Failed to URL decode text')
  }
}

export default urlDecode
