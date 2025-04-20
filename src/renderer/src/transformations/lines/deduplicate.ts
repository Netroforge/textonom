import type { TransformationFunction } from '../../types'

/**
 * Removes duplicate lines
 */
const deduplicateLines: TransformationFunction = async (text: string): Promise<string> => {
  if (!text) return text
  // Handle different types of newlines (CR, LF, CRLF)
  const lines = text.split(/\r\n|\r|\n/)
  return [...new Set(lines)].join('\n')
}

export default deduplicateLines
