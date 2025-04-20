import { Base64 } from 'js-base64'
import type { TransformationFunction } from '../../types'

/**
 * Encodes text to Base64
 */
const base64Encode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return Base64.encode(text)
  } catch (error) {
    console.error('Error encoding to Base64:', error)
    throw new Error('Failed to encode text to Base64')
  }
}

export default base64Encode
