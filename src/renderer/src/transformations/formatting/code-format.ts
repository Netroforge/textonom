import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'
import htmlFormat from './html-format'
import cssFormat from './css-format'
import jsFormat from './js-format'
import xmlFormat from './xml-format'

/**
 * Formats code (HTML, CSS, JavaScript, XML) with proper indentation
 * @param text - The code to format
 * @param params - Parameters for code formatting
 * @param params.language - Language of the code (html, css, js, xml)
 * @param params.indentSize - Number of spaces for indentation (default: 2)
 * @returns The formatted code
 * @throws Error if formatting fails
 * @deprecated Use the specific language formatters instead (htmlFormat, cssFormat, jsFormat, xmlFormat)
 */
const codeFormat: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Get parameters with defaults
    const language = (params?.language as string) || 'html'
    const indentSize = Number(params?.indentSize ?? 2)

    // Use the appropriate formatter based on language
    switch (language.toLowerCase()) {
      case 'html':
        return await htmlFormat(text, { indentSize })
      case 'css':
        return await cssFormat(text, { indentSize })
      case 'js':
      case 'javascript':
        return await jsFormat(text, { indentSize })
      case 'xml':
        return await xmlFormat(text, { indentSize })
      default:
        throw new Error(`Unsupported language: ${language}`)
    }
  } catch (error) {
    console.error('Error formatting code:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to format code: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to format code: ${error}`)
    } else {
      throw new Error('Failed to format code: Unknown error')
    }
  }
}

export default codeFormat
