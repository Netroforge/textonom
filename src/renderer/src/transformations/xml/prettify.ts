import xmlFormat from 'xml-formatter'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Formats XML with proper indentation
 */
const xmlPrettify: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return xmlFormat(text)
  } catch (error) {
    const err = error as Error
    throw new Error('Failed to prettify XML: ' + err.message)
  }
}

export default xmlPrettify
