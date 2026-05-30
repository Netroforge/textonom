import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Replaces runs of leading spaces with tab characters.
 * Only indentation (start of each line) is converted.
 * @param params.tabSize - Number of spaces that make up one tab (default: 4)
 */
const spacesToTabs: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') {
    return ''
  }

  const tabSize = Number(params?.tabSize ?? 4)
  if (!Number.isInteger(tabSize) || tabSize < 1 || tabSize > 16) {
    throw new Error('Tab size must be an integer between 1 and 16')
  }

  return text
    .split(/\r\n|\r|\n/)
    .map((line) => {
      const match = line.match(/^ +/)
      if (!match) return line
      const indent = match[0]
      const tabs = '\t'.repeat(Math.floor(indent.length / tabSize))
      const remainder = ' '.repeat(indent.length % tabSize)
      return tabs + remainder + line.slice(indent.length)
    })
    .join('\n')
}

export default spacesToTabs
