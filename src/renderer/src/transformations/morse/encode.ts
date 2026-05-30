import type { TransformationFunction } from '../../types/transformation'
import { CHAR_TO_MORSE } from './table'

/**
 * Encodes text to International Morse code.
 * Letters are separated by a single space and words by " / ".
 */
const morseEncode: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  return text
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .map((word) =>
      Array.from(word)
        .map((char) => {
          const code = CHAR_TO_MORSE[char]
          if (code === undefined) {
            throw new Error(`Cannot encode character: "${char}"`)
          }
          return code
        })
        .join(' ')
    )
    .join(' / ')
}

export default morseEncode
