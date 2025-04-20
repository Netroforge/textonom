import * as CryptoJS from 'crypto-js'
import type { TransformationFunction } from '../../types'

/**
 * Generates SHA-1 hash of the input text
 */
const sha1Hash: TransformationFunction = async (text: string): Promise<string> => {
  return CryptoJS.SHA1(text).toString()
}

export default sha1Hash
