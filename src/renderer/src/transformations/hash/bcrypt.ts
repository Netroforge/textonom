import * as bcrypt from 'bcryptjs'
import { useSettingsStore } from '../../store/settingsStore'
import type { TransformationFunction } from '../../types'

/**
 * Generates bcrypt hash of the input text
 * @param text - The text to hash
 * @param costFactor - Optional cost factor (rounds) for bcrypt
 */
const bcryptHash: TransformationFunction = async (
  text: string,
  costFactor?: number
): Promise<string> => {
  // If no cost factor is provided, use the one from settings
  if (costFactor === undefined) {
    const settingsStore = useSettingsStore()
    costFactor = settingsStore.bcryptRounds
  }

  // Ensure the cost factor is within the allowed range (1-20)
  costFactor = Math.max(1, Math.min(20, Number(costFactor)))

  // Use the async version of bcrypt hash to prevent UI freezing
  // This wraps the callback-based hash in a Promise
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(text, costFactor, (err, hash) => {
      if (err) {
        reject(new Error('Failed to generate bcrypt hash: ' + err.message))
      } else {
        // Ensure hash is always a string
        resolve(hash || '')
      }
    })
  })
}

export default bcryptHash
