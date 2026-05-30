import type { TransformationFunction } from '../../types/transformation'

/**
 * Reverses the characters in the text (Unicode code-point aware)
 */
const reverseString: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }
  return Array.from(text).reverse().join('')
}

export default reverseString
