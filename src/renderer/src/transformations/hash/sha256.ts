import * as CryptoJS from 'crypto-js'
import type { TransformationFunction } from '../../types'

/**
 * Generates SHA-256 hash of the input text
 */
const sha256Hash: TransformationFunction = async (text: string): Promise<string> => {
  return CryptoJS.SHA256(text).toString()
}

export default sha256Hash
