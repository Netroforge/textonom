import { Base64 } from 'js-base64'
import type { TransformationFunction } from '../../types'

/**
 * Decodes Base64 text to plain text
 */
const base64Decode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return Base64.decode(text)
  } catch (error) {
    console.error('Error decoding from Base64:', error)
    throw new Error('Failed to decode Base64 text')
  }
}

export default base64Decode
