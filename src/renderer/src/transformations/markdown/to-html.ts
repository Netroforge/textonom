import { marked } from 'marked'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts Markdown text to HTML
 * @param text - The Markdown text to convert
 * @returns The HTML representation of the Markdown text
 * @throws Error if conversion fails
 */
const markdownToHtml: TransformationFunction = async (text: string): Promise<string> => {
  // Handle empty input
  if (text === '') {
    return ''
  }

  try {
    marked.setOptions({
      gfm: true,
      breaks: true,
      pedantic: false
    })

    return await marked.parse(text)
  } catch (error) {
    console.error('Error converting Markdown to HTML:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to convert Markdown to HTML: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to convert Markdown to HTML: ${error}`)
    } else {
      throw new Error('Failed to convert Markdown to HTML: Unknown error')
    }
  }
}

export default markdownToHtml
