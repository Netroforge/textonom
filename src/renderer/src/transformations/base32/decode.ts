import type { TransformationFunction } from '../../types/transformation'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Decodes Base32 (RFC 4648) text to plain text
 */
const base32Decode: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    const cleaned = text.replace(/=+$/, '').replace(/\s+/g, '').toUpperCase()

    let bits = 0
    let value = 0
    const bytes: number[] = []

    for (const char of cleaned) {
      const idx = ALPHABET.indexOf(char)
      if (idx === -1) {
        throw new Error(`Invalid Base32 character: "${char}"`)
      }
      value = (value << 5) | idx
      bits += 5
      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 0xff)
        bits -= 8
      }
    }

    return new TextDecoder().decode(new Uint8Array(bytes))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decode Base32: ${error.message}`)
    }
    throw new Error('Failed to decode Base32: Unknown error')
  }
}

export default base32Decode
