import type { TransformationFunction } from '../../types'

/**
 * Converts text to title case (first letter of each word capitalized)
 */
const toTitleCase: TransformationFunction = async (text: string): Promise<string> => {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default toTitleCase
