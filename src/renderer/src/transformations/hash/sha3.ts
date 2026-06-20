import * as CryptoJS from 'crypto-js'
import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

const VALID_LENGTHS = [224, 256, 384, 512]

/**
 * Generates a SHA-3 (Keccak) hash of the input text
 * @param text - The text to hash
 * @param params.outputLength - Digest length in bits (224, 256, 384, or 512)
 */
const sha3Hash: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') {
    return ''
  }

  const outputLength = Number(params?.outputLength ?? 512)
  if (!VALID_LENGTHS.includes(outputLength)) {
    throw new Error('Output length must be 224, 256, 384, or 512')
  }

  try {
    return CryptoJS.SHA3(text, { outputLength }).toString()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate SHA-3 hash: ${error.message}`)
    }
    throw new Error('Failed to generate SHA-3 hash: Unknown error')
  }
}

export default sha3Hash
