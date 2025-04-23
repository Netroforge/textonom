import type { TransformationFunction } from '../../types'

/**
 * Decodes hexadecimal text to plain text
 * @param text - The hexadecimal text to decode
 * @returns The decoded string
 * @throws Error if decoding fails
 */
const hexDecode: TransformationFunction = async (text: string): Promise<string> => {
  // Handle empty input
  if (text === '') {
    return ''
  }

  try {
    // Remove any whitespace and ensure lowercase for consistency
    const cleanHex = text.replace(/\s+/g, '').toLowerCase()

    // Validate that the input is a valid hex string
    if (!/^[0-9a-f]*$/.test(cleanHex)) {
      throw new Error('Input contains invalid hexadecimal characters')
    }

    // Ensure we have an even number of characters (complete bytes)
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Hexadecimal string must have an even number of digits')
    }

    // Convert hex pairs to characters
    let result = ''
    for (let i = 0; i < cleanHex.length; i += 2) {
      const hexPair = cleanHex.substring(i, i + 2)
      const charCode = parseInt(hexPair, 16)
      result += String.fromCharCode(charCode)
    }

    return result
  } catch (error) {
    console.error('Error decoding from hex:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to decode hex: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to decode hex: ${error}`)
    } else {
      throw new Error('Failed to decode hex: Unknown error')
    }
  }
}

export default hexDecode
