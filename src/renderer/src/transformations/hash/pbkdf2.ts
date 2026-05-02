import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'
import { pbkdf2InWorker } from '../../workers/hashWorkerClient'

const HASH_ALGORITHMS = ['SHA1', 'SHA256', 'SHA512'] as const
type HashAlgorithm = (typeof HASH_ALGORITHMS)[number]

const pbkdf2Hash: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') return ''

  const algorithm = String(params?.algorithm ?? 'SHA256').toUpperCase() as HashAlgorithm
  const iterations = Number(params?.iterations ?? 100000)
  const keyLength = Number(params?.keyLength ?? 32)
  const salt = typeof params?.salt === 'string' ? params.salt : ''

  if (!HASH_ALGORITHMS.includes(algorithm)) {
    throw new Error('Algorithm must be SHA1, SHA256, or SHA512')
  }
  if (!Number.isFinite(iterations) || iterations < 1 || iterations > 1_000_000) {
    throw new Error('Iterations must be between 1 and 1,000,000')
  }
  if (!Number.isFinite(keyLength) || keyLength < 8 || keyLength > 128) {
    throw new Error('Key length must be between 8 and 128 bytes')
  }

  try {
    return await pbkdf2InWorker(text, algorithm, iterations, keyLength, salt)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate PBKDF2 hash: ${error.message}`)
    }
    throw new Error('Failed to generate PBKDF2 hash: Unknown error')
  }
}

export default pbkdf2Hash
