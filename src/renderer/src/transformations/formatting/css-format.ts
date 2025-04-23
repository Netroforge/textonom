import * as prettier from 'prettier/standalone'
import * as prettierPluginCss from 'prettier/plugins/postcss'
import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Formats CSS code with proper indentation
 * @param text - The CSS code to format
 * @param params - Parameters for CSS formatting
 * @param params.indentSize - Number of spaces for indentation (default: 2)
 * @returns The formatted CSS code
 * @throws Error if formatting fails
 */
const cssFormat: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Get parameters with defaults
    const indentSize = Number(params?.indentSize ?? 2)

    // Format the CSS code
    const formatted = await prettier.format(text, {
      parser: 'css',
      plugins: [prettierPluginCss],
      tabWidth: indentSize,
      printWidth: 100,
      singleQuote: true
    })

    return formatted
  } catch (error) {
    console.error('Error formatting CSS:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to format CSS: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to format CSS: ${error}`)
    } else {
      throw new Error('Failed to format CSS: Unknown error')
    }
  }
}

export default cssFormat
