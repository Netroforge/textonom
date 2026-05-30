import type { TransformationFunction } from '../../types/transformation'

/**
 * Reports statistics about the input text: characters, words, lines, bytes,
 * and an estimated reading time.
 */
const textStatistics: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return [
      'Characters: 0',
      'Characters (no spaces): 0',
      'Words: 0',
      'Lines: 0',
      'Bytes (UTF-8): 0',
      'Reading time: 0 sec'
    ].join('\n')
  }

  const characters = Array.from(text).length
  const charactersNoSpaces = Array.from(text.replace(/\s/g, '')).length
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const lines = text.split(/\r\n|\r|\n/).length
  const bytes = new TextEncoder().encode(text).length

  // Average adult reading speed ~200 words per minute
  const readingSeconds = Math.ceil((words / 200) * 60)
  const readingTime =
    readingSeconds < 60
      ? `${readingSeconds} sec`
      : `${Math.floor(readingSeconds / 60)} min ${readingSeconds % 60} sec`

  return [
    `Characters: ${characters}`,
    `Characters (no spaces): ${charactersNoSpaces}`,
    `Words: ${words}`,
    `Lines: ${lines}`,
    `Bytes (UTF-8): ${bytes}`,
    `Reading time: ${readingTime}`
  ].join('\n')
}

export default textStatistics
