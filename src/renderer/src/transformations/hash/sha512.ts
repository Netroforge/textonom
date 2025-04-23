import * as CryptoJS from 'crypto-js'
import type { TransformationFunction } from '../../types'

/**
 * Generates SHA-512 hash of the input text
 * @param text - The text to hash
 * @returns The SHA-512 hash of the input text
 */
const sha512Hash: TransformationFunction = async (text: string): Promise<string> => {
  // Handle empty input
  if (text === '') {
    return ''
  }

  try {
    return CryptoJS.SHA512(text).toString()
  } catch (error) {
    console.error('Error generating SHA-512 hash:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate SHA-512 hash: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to generate SHA-512 hash: ${error}`)
    } else {
      throw new Error('Failed to generate SHA-512 hash: Unknown error')
    }
  }
}

export default sha512Hash
