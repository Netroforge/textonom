import type { TransformationFunction } from '../../types/transformation'

/**
 * Compacts JSON by removing all whitespace
 */
const jsonCompact: TransformationFunction = async (text: string): Promise<string> => {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed)
  } catch {
    throw new Error('Failed to compact JSON: Invalid JSON format')
  }
}

export default jsonCompact
