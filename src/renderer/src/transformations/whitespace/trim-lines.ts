import type { TransformationFunction } from '../../types/transformation'

/**
 * Removes trailing whitespace from the end of every line.
 */
const trimLines: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  return text
    .split(/\r\n|\r|\n/)
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
}

export default trimLines
