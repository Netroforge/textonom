import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Applies a Caesar cipher shift to the alphabetic characters in the text.
 * Non-letters are left unchanged. Use a negative shift to decode.
 * @param params.shift - Number of positions to shift (default: 3)
 */
const caesarCipher: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') {
    return ''
  }

  const rawShift = Number(params?.shift ?? 3)
  if (!Number.isFinite(rawShift)) {
    throw new Error('Shift must be a number')
  }
  // Normalize into 0..25 so negative shifts decode correctly
  const shift = ((Math.trunc(rawShift) % 26) + 26) % 26

  return text.replace(/[a-z]/gi, (char) => {
    const base = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base)
  })
}

export default caesarCipher
