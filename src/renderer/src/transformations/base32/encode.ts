import type { TransformationFunction } from '../../types/transformation'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Encodes text to Base32 (RFC 4648, with padding)
 */
const base32Encode: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    const bytes = new TextEncoder().encode(text)
    let bits = 0
    let value = 0
    let output = ''

    for (const byte of bytes) {
      value = (value << 8) | byte
      bits += 8
      while (bits >= 5) {
        output += ALPHABET[(value >>> (bits - 5)) & 31]
        bits -= 5
      }
    }

    if (bits > 0) {
      output += ALPHABET[(value << (5 - bits)) & 31]
    }

    // Pad to a multiple of 8 characters
    while (output.length % 8 !== 0) {
      output += '='
    }

    return output
  } catch (error) {
    console.error('Error encoding to Base32:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to encode text to Base32: ${error.message}`)
    }
    throw new Error('Failed to encode text to Base32: Unknown error')
  }
}

export default base32Encode
