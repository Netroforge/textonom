import TurndownService from 'turndown'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts HTML to Markdown
 */
const htmlToMarkdown: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    const turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    })
    return turndown.turndown(text)
  } catch (error) {
    const err = error as Error
    throw new Error('Failed to convert HTML to Markdown: ' + err.message)
  }
}

export default htmlToMarkdown
