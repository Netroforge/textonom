import type { TransformationFunction } from '../../types/transformation'

const NUMERALS: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']
]

/**
 * Converts integers (1-3999, one per line) to Roman numerals.
 */
const numberToRoman: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  return text
    .split('\n')
    .map((raw) => {
      const line = raw.trim()
      if (!line) return ''
      const num = Number(line)
      if (!Number.isInteger(num) || num < 1 || num > 3999) {
        throw new Error(`"${raw}" is not an integer between 1 and 3999`)
      }
      let remaining = num
      let result = ''
      for (const [value, symbol] of NUMERALS) {
        while (remaining >= value) {
          result += symbol
          remaining -= value
        }
      }
      return result
    })
    .join('\n')
}

export default numberToRoman
