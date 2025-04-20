import type { TransformationFunction } from '../../types'

/**
 * Converts text to lowercase
 */
const toLowerCase: TransformationFunction = async (text: string): Promise<string> =>
  text.toLowerCase()

export default toLowerCase
