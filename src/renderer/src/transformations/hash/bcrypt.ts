import type { TransformationFunction } from '../../types/transformation'
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

export default bcryptHash
