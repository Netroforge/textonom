import type { TransformationFunction } from '../../types/transformation'

/**
 * Encodes text to a space-separated string of 8-bit binary bytes (UTF-8)
 */
const binaryEncode: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  const bytes = new TextEncoder().encode(text)
  return Array.from(bytes, (byte) => byte.toString(2).padStart(8, '0')).join(' ')
}

export default binaryEncode
