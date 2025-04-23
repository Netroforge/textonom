import * as CryptoJS from 'crypto-js'
import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Generates HMAC hash of the input text using the specified algorithm
 * @param text - The text to hash
 * @param params - Parameters for HMAC generation
 * @param params.key - The secret key for HMAC
 * @param params.algorithm - The algorithm to use (SHA-256, SHA-512)
 * @returns The HMAC hash of the input text
 * @throws Error if hashing fails or if inputs are invalid
 */
const hmacHash: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  // Handle empty input
  if (text === '') {
    return ''
  }

  try {
    // Get parameters
    const key = (params?.key as string) || ''
    const algorithm = (params?.algorithm as string) || 'SHA256'

    if (!key) {
      throw new Error('Secret key is required')
    }

    // Generate HMAC based on the selected algorithm
    let hmac: CryptoJS.lib.WordArray

    switch (algorithm) {
      case 'SHA256':
        hmac = CryptoJS.HmacSHA256(text, key)
        break
      case 'SHA512':
        hmac = CryptoJS.HmacSHA512(text, key)
        break
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`)
    }

    // Return the HMAC as a hex string
    return hmac.toString()
  } catch (error) {
    console.error('Error generating HMAC:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate HMAC: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to generate HMAC: ${error}`)
    } else {
      throw new Error('Failed to generate HMAC: Unknown error')
    }
  }
}

export default hmacHash
