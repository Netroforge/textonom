import type { TransformationFunction, TransformationParamValues } from '../../types/transformation'
import bcryptjs from 'bcryptjs'
import { bcryptInWorker } from '../../workers/hashWorkerClient'

const bcryptHash: TransformationFunction = async (
  text: string,
  costFactor?: number
): Promise<string> => {
  if (text === '') return ''

  const rounds = Number(costFactor ?? 12)
  if (Number.isNaN(rounds)) {
    throw new Error('Cost factor must be a number')
  }
  if (rounds < 1 || rounds > 20) {
    throw new Error('Cost factor must be between 1 and 20')
  }

  try {
    return await bcryptInWorker(text, rounds)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate bcrypt hash: ${error.message}`)
    }
    throw new Error('Failed to generate bcrypt hash: Unknown error')
  }
}

export const bcryptVerify: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (!text) return ''
  const hash = (params?.hash as string) || ''
  if (!hash) throw new Error('Hash is required')

  try {
    const match = await bcryptjs.compare(text, hash)
    return match
      ? '✓ Match — the text matches the hash'
      : '✗ No match — the text does not match the hash'
  } catch {
    throw new Error('Invalid bcrypt hash format')
  }
}

export default bcryptHash
