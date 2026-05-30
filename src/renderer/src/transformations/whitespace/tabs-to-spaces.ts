import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Replaces tab characters with spaces.
 * @param params.tabSize - Number of spaces per tab (default: 4)
 */
const tabsToSpaces: TransformationFunction = async (
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

  return text.replace(/\t/g, ' '.repeat(tabSize))
}

export default tabsToSpaces
