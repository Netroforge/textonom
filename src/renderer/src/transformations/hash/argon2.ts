import * as CryptoJS from 'crypto-js'
import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Simulates Argon2 hash of the input text using PBKDF2
 * Note: This is not a true Argon2 implementation but a simulation using PBKDF2
 * for browser compatibility. For real security, use a proper Argon2 implementation.
 *
 * @param text - The text to hash
 * @param params - Parameters for hashing
 * @param params.type - The variant to use (0=argon2d, 1=argon2i, 2=argon2id)
 * @param params.memoryCost - Memory usage simulation (default: 1024)
 * @param params.timeCost - Number of iterations multiplier (default: 3)
 * @param params.parallelism - Not used in this simulation
 * @returns A hash string formatted to look like Argon2
 * @throws Error if hashing fails or if inputs are invalid
 */
const argon2Hash: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  // Handle empty input
  if (text === '') {
    return ''
  }

  try {
    // Get parameters with defaults
    const type = Number(params?.type ?? 2) // Default to argon2id (most secure for general use)
    const memoryCost = Number(params?.memoryCost ?? 1024)
    const timeCost = Number(params?.timeCost ?? 3)
    const parallelism = Number(params?.parallelism ?? 1)

    // Validate parameters
    if (![0, 1, 2].includes(type)) {
      throw new Error('Type must be 0 (argon2d), 1 (argon2i), or 2 (argon2id)')
    }

    if (memoryCost < 256) {
      throw new Error('Memory cost should be at least 256 KiB for security')
    }

    if (timeCost < 1) {
      throw new Error('Time cost must be at least 1')
    }

    if (parallelism < 1) {
      throw new Error('Parallelism must be at least 1')
    }

    // Generate a salt
    const salt = CryptoJS.lib.WordArray.random(16)
    const saltHex = salt.toString()

    // Choose the appropriate variant name
    let variant: string
    switch (type) {
      case 0:
        variant = 'argon2d'
        break
      case 1:
        variant = 'argon2i'
        break
      case 2:
      default:
        variant = 'argon2id'
        break
    }

    // Calculate iterations based on parameters
    // This is a simulation - real Argon2 would use memory and parallelism differently
    const iterations = 1000 * timeCost * Math.log2(memoryCost)

    // Generate the hash using PBKDF2
    const hash = CryptoJS.PBKDF2(text, salt, {
      keySize: 8, // 256 bits
      iterations: Math.floor(iterations)
    })

    // Format the result to look like an Argon2 hash
    return `$${variant}$v=19$m=${memoryCost},t=${timeCost},p=${parallelism}$${saltHex}$${hash.toString()}`
  } catch (error) {
    console.error('Error generating Argon2 hash:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate Argon2 hash: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to generate Argon2 hash: ${error}`)
    } else {
      throw new Error('Failed to generate Argon2 hash: Unknown error')
    }
  }
}

export default argon2Hash
