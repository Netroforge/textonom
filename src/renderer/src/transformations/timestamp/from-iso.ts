import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

const isoToTimestamp: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') return ''
  const unit = String(params?.unit ?? 'seconds')

  const lines = text.split('\n')
  const out: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      out.push('')
      continue
    }
    const ms = Date.parse(line)
    if (Number.isNaN(ms)) {
      throw new Error(`Not a valid ISO 8601 date: "${line}"`)
    }
    out.push(unit === 'milliseconds' ? String(ms) : String(Math.floor(ms / 1000)))
  }
  return out.join('\n')
}

export default isoToTimestamp
