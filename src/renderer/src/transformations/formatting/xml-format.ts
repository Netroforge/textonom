import xmlFormatter from 'xml-formatter'
import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Formats XML code with proper indentation using xml-formatter
 * @param text - The XML code to format
 * @param params - Parameters for XML formatting
 * @param params.indentSize - Number of spaces for indentation (default: 2)
 * @returns The formatted XML code
 * @throws Error if formatting fails
 */
const xmlFormat: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Get parameters with defaults
    const indentSize = Number(params?.indentSize ?? 2)

    // Format the XML using xml-formatter
    const formatted = xmlFormatter(text, {
      indentation: ' '.repeat(indentSize),
      lineSeparator: '\n',
      collapseContent: false
    })
    return formatted
  } catch (error) {
    console.error('Error formatting XML:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to format XML: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to format XML: ${error}`)
    } else {
      throw new Error('Failed to format XML: Unknown error')
    }
  }
}

export default xmlFormat
