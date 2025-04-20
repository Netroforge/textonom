import type { TransformationFunction } from '../../types'

/**
 * Unescapes \uXXXX format to actual Unicode characters
 */
const unicodeUnescape: TransformationFunction = async (text: string): Promise<string> => {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16))
  })
}

export default unicodeUnescape
