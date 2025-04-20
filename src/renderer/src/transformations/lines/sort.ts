import type { TransformationFunction } from '../../types'

/**
 * Sorts lines alphabetically
 */
const sortLines: TransformationFunction = async (text: string): Promise<string> => {
  if (!text) return text
  // Handle different types of newlines (CR, LF, CRLF)
  const lines = text.split(/\r\n|\r|\n/)
  return lines.sort().join('\n')
}

export default sortLines
