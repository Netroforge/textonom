import xmlFormat from 'xml-formatter'
import type { TransformationFunction } from '../../types'

/**
 * Formats XML with proper indentation
 */
const xmlPrettify: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return xmlFormat(text)
  } catch (error) {
    console.error('Error prettifying XML:', error)
    const err = error as Error
    throw new Error('Failed to prettify XML: ' + err.message)
  }
}

export default xmlPrettify
