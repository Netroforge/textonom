import { Base64 } from 'js-base64'
import type { TransformationFunction } from '../../types'

/**
 * Encodes text to Base64
 * @param text - The text to encode
 * @returns The Base64 encoded string
 * @throws Error if encoding fails
 */
const base64Encode: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    return Base64.encode(text)
  } catch (error) {
    console.error('Error encoding to Base64:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to encode text to Base64: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to encode text to Base64: ${error}`)
    } else {
      throw new Error('Failed to encode text to Base64: Unknown error')
    }
  }
}

export default base64Encode
