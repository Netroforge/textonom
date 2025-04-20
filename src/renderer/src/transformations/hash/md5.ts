import * as CryptoJS from 'crypto-js'
import type { TransformationFunction } from '../../types'

/**
 * Generates MD5 hash of the input text
 */
const md5Hash: TransformationFunction = async (text: string): Promise<string> => {
  return CryptoJS.MD5(text).toString()
}

export default md5Hash
