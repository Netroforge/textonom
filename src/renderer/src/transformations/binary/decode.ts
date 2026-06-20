import type { TransformationFunction } from '../../types/transformation'

/**
 * Decodes a string of binary bytes back to text (UTF-8).
 * Accepts bytes separated by whitespace, or a continuous stream of bits whose
 * length is a multiple of 8.
 */
const binaryDecode: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    const compact = text.replace(/\s+/g, '')
    if (!/^[01]+$/.test(compact)) {
      throw new Error('Input must contain only 0s and 1s')
    }
    if (compact.length % 8 !== 0) {
      throw new Error('Number of bits must be a multiple of 8')
    }

    const bytes: number[] = []
    for (let i = 0; i < compact.length; i += 8) {
      bytes.push(parseInt(compact.slice(i, i + 8), 2))
    }

    return new TextDecoder().decode(new Uint8Array(bytes))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decode binary: ${error.message}`)
    }
    throw new Error('Failed to decode binary: Unknown error')
  }
}

export default binaryDecode
