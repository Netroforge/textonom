import type { TransformationFunction } from '../../types/transformation'

const VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000
}

const VALID = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/

/**
 * Converts Roman numerals (one per line) to integers.
 */
const romanToNumber: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  return text
    .split('\n')
    .map((raw) => {
      const line = raw.trim().toUpperCase()
      if (!line) return ''
      if (!VALID.test(line)) {
        throw new Error(`"${raw}" is not a valid Roman numeral`)
      }
      let total = 0
      for (let i = 0; i < line.length; i++) {
        const current = VALUES[line[i]]
        const next = VALUES[line[i + 1]]
        total += next > current ? -current : current
      }
      return String(total)
    })
    .join('\n')
}

export default romanToNumber
