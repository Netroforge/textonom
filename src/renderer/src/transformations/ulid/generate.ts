import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

// Crockford's Base32 alphabet (no I, L, O, U)
const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const TIME_LEN = 10
const RANDOM_LEN = 16

const encodeTime = (now: number): string => {
  let time = now
  let out = ''
  for (let i = TIME_LEN - 1; i >= 0; i--) {
    out = ENCODING[time % 32] + out
    time = Math.floor(time / 32)
  }
  return out
}

const encodeRandom = (): string => {
  const bytes = new Uint8Array(RANDOM_LEN)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < RANDOM_LEN; i++) {
    out += ENCODING[bytes[i] % 32]
  }
  return out
}

/**
 * Generates one or more ULIDs (Universally Unique Lexicographically Sortable
 * Identifiers), one per line.
 * @param params.count - Number of ULIDs to generate (default: 1)
 */
const ulidGenerate: TransformationFunction = async (
  _text: string,
  params?: TransformationParamValues
): Promise<string> => {
  const count = Math.max(1, Math.min(1000, Number(params?.count ?? 1)))
  const now = Date.now()

  const ulids: string[] = []
  for (let i = 0; i < count; i++) {
    ulids.push(encodeTime(now) + encodeRandom())
  }
  return ulids.join('\n')
}

export default ulidGenerate
