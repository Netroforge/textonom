import * as bcrypt from 'bcryptjs'
import type { TransformationFunction } from '../../types'

/**
 * Generates bcrypt hash of the input text
 * @param text - The text to hash
 * @param costFactor - Optional cost factor (rounds) for bcrypt (1-20)
 * @returns The bcrypt hash of the input text
 * @throws Error if hashing fails or if inputs are invalid
 */
const bcryptHash: TransformationFunction = async (
  text: string,
  costFactor?: number
): Promise<string> => {
  // Handle empty input
  if (text === '') {
    return ''
  }

  // If no cost factor is provided, use a default value
  if (costFactor === undefined) {
    costFactor = 12 // Default value
  }

  // Validate cost factor
  const rounds = Number(costFactor)
  if (isNaN(rounds)) {
    throw new Error('Cost factor must be a number')
  }

  // Ensure the cost factor is within the allowed range (1-20)
  if (rounds < 1 || rounds > 20) {
    throw new Error('Cost factor must be between 1 and 20')
  }

  // Use the async version of bcrypt hash to prevent UI freezing
  // This wraps the callback-based hash in a Promise
  return new Promise<string>((resolve, reject) => {
    try {
      bcrypt.hash(text, rounds, (err, hash) => {
        if (err) {
          reject(new Error(`Failed to generate bcrypt hash: ${err.message}`))
        } else if (!hash) {
          reject(new Error('Failed to generate bcrypt hash: No hash returned'))
        } else {
          resolve(hash)
        }
      })
    } catch (error) {
      // Handle any synchronous errors from bcrypt.hash
      if (error instanceof Error) {
        reject(new Error(`Failed to generate bcrypt hash: ${error.message}`))
      } else {
        reject(new Error('Failed to generate bcrypt hash: Unknown error'))
      }
    }
  })
}

export default bcryptHash
