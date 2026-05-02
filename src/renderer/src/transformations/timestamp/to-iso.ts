import type { TransformationFunction } from '../../types/transformation'

const timestampToIso: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') return ''

  const lines = text.split('\n')
  const out: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      out.push('')
      continue
    }
    const num = Number(line)
    if (!Number.isFinite(num)) {
      throw new Error(`Not a numeric timestamp: "${line}"`)
    }
    // Heuristic: if value looks like seconds (< year 5000 in seconds), treat as seconds.
    const ms = num < 1e12 ? num * 1000 : num
    const date = new Date(ms)
    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid timestamp: "${line}"`)
    }
    out.push(date.toISOString())
  }
  return out.join('\n')
}

export default timestampToIso
