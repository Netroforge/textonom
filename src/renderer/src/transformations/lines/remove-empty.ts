import type { TransformationFunction } from '../../types'

/**
 * Removes empty lines from text
 * @param text - The text to process
 * @returns The text with empty lines removed
 */
const removeEmptyLines: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Split text into lines
    const lines = text.split(/\r?\n/)

    // Filter out empty lines (those that are empty or contain only whitespace)
    const nonEmptyLines = lines.filter((line) => line.trim() !== '')

    // Join the non-empty lines back together
    return nonEmptyLines.join('\n')
  } catch (error) {
    console.error('Error removing empty lines:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to remove empty lines: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to remove empty lines: ${error}`)
    } else {
      throw new Error('Failed to remove empty lines: Unknown error')
    }
  }
}

export default removeEmptyLines
