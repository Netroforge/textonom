import type { TransformationFunction } from '../../types/transformation'
import { MORSE_TO_CHAR } from './table'

/**
 * Decodes International Morse code back to text.
 * Letters are expected to be separated by spaces and words by "/".
 */
const morseDecode: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  return text
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .split(/\s+/)
        .filter((code) => code !== '')
        .map((code) => {
          const char = MORSE_TO_CHAR[code]
          if (char === undefined) {
            throw new Error(`Cannot decode Morse sequence: "${code}"`)
          }
          return char
        })
        .join('')
    )
    .join(' ')
}

export default morseDecode
