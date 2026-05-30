import type { TransformationFunction } from '../../types/transformation'

/**
 * Strips HTML tags from the input, returning the rendered text content.
 */
const stripHtmlTags: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  const el = document.createElement('div')
  el.innerHTML = text
  return el.textContent ?? ''
}

export default stripHtmlTags
