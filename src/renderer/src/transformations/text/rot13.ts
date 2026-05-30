import type { TransformationFunction } from '../../types/transformation'

/**
 * Applies the ROT13 substitution cipher. Running it twice returns the original
 * text, so the same transformation both encodes and decodes.
 */
const rot13: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  return text.replace(/[a-z]/gi, (char) => {
    const base = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base)
  })
}

export default rot13
