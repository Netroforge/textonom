import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

const baseConvert: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') return ''
  const fromBase = Number(params?.fromBase ?? 10)
  const toBase = Number(params?.toBase ?? 16)

  if (![2, 8, 10, 16].includes(fromBase) || ![2, 8, 10, 16].includes(toBase)) {
    throw new Error('Bases must be 2, 8, 10, or 16')
  }

  const lines = text.split('\n')
  const out: string[] = []
  for (const raw of lines) {
    const line = raw.trim().replace(/^0[bxo]/i, '')
    if (!line) {
      out.push('')
      continue
    }
    const parsed = parseInt(line, fromBase)
    if (Number.isNaN(parsed)) {
      throw new Error(`"${raw}" is not a valid base-${fromBase} number`)
    }
    out.push(parsed.toString(toBase))
  }
  return out.join('\n')
}

export default baseConvert
