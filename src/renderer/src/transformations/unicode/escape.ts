import type { TransformationFunction } from '../../types'

/**
 * Escapes Unicode characters to \uXXXX format
 */
const unicodeEscape: TransformationFunction = async (text: string): Promise<string> => {
  return text.replace(/[\u007F-\uFFFF]/g, (char) => {
    return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4)
  })
}

export default unicodeEscape
