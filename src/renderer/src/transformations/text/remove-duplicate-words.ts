import type { TransformationFunction } from '../../types'

/**
 * Removes duplicate words from text
 * @param text - The text to process
 * @returns The text with duplicate words removed
 */
const removeDuplicateWords: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Split text into words, preserving whitespace and punctuation
    const words = text.match(/\S+|\s+/g) || []

    // Keep track of seen words (case-insensitive)
    const seenWords = new Set<string>()

    // Filter out duplicate words, preserving whitespace and punctuation
    const result = words.filter((word) => {
      // If it's whitespace or punctuation, keep it
      if (/^\s+$|^[^\w\s]+$/.test(word)) {
        return true
      }

      // Check if we've seen this word before (case-insensitive)
      const lowerWord = word.toLowerCase()
      if (seenWords.has(lowerWord)) {
        return false
      }

      // Add the word to the set of seen words
      seenWords.add(lowerWord)
      return true
    })

    // Join the words back together
    return result.join('')
  } catch (error) {
    console.error('Error removing duplicate words:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to remove duplicate words: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to remove duplicate words: ${error}`)
    } else {
      throw new Error('Failed to remove duplicate words: Unknown error')
    }
  }
}

export default removeDuplicateWords
