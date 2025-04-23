import type { TransformationFunction } from '../../types'

/**
 * Encodes text to hexadecimal representation
 * @param text - The text to encode
 * @returns The hexadecimal encoded string
 */
const hexEncode: TransformationFunction = async (text: string): Promise<string> => {
  // Handle empty input
  if (text === '') {
    return ''
  }

  try {
    // Convert each character to its hex representation
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const hex = text.charCodeAt(i).toString(16)
      // Ensure each byte is represented by two hex digits
      result += hex.length === 1 ? '0' + hex : hex
    }
    return result
  } catch (error) {
    console.error('Error encoding to hex:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to encode text to hex: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to encode text to hex: ${error}`)
    } else {
      throw new Error('Failed to encode text to hex: Unknown error')
    }
  }
}

export default hexEncode
