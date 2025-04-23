import { marked } from 'marked'
import type { TransformationFunction } from '../../types'

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
    // Configure marked options
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert line breaks to <br>
      headerIds: true, // Include header IDs
      mangle: false, // Don't escape HTML
      pedantic: false, // Don't conform to original markdown.pl
      smartLists: true, // Use smarter list behavior
      smartypants: true // Use "smart" typographic punctuation
    })

    // Convert markdown to HTML
    return marked.parse(text)
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
