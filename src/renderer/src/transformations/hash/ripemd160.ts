import * as CryptoJS from 'crypto-js'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Generates a RIPEMD-160 hash of the input text
 */
const ripemd160Hash: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    return CryptoJS.RIPEMD160(text).toString()
  } catch (error) {
    console.error('Error generating RIPEMD-160 hash:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate RIPEMD-160 hash: ${error.message}`)
    }
    throw new Error('Failed to generate RIPEMD-160 hash: Unknown error')
  }
}

export default ripemd160Hash
