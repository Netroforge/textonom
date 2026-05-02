import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts text to lowercase
 */
const toLowerCase: TransformationFunction = async (text: string): Promise<string> =>
  text.toLowerCase()

export default toLowerCase
