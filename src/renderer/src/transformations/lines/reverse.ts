import type { TransformationFunction } from '../../types'

/**
 * Reverses the order of lines
 */
const reverseLines: TransformationFunction = async (text: string): Promise<string> => {
  if (!text) return text
  // Handle different types of newlines (CR, LF, CRLF)
  const lines = text.split(/\r\n|\r|\n/)
  return lines.reverse().join('\n')
}

export default reverseLines
