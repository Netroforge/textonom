import type { TransformationFunction } from '../../types'

/**
 * Converts text to uppercase
 */
const toUpperCase: TransformationFunction = async (text: string): Promise<string> =>
  text.toUpperCase()

export default toUpperCase
