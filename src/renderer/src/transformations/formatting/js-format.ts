import * as prettier from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Formats JavaScript code with proper indentation
 * @param text - The JavaScript code to format
 * @param params - Parameters for JavaScript formatting
 * @param params.indentSize - Number of spaces for indentation (default: 2)
 * @returns The formatted JavaScript code
 * @throws Error if formatting fails
 */
const jsFormat: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Get parameters with defaults
    const indentSize = Number(params?.indentSize ?? 2)

    // Format the JavaScript code
    const formatted = await prettier.format(text, {
      parser: 'babel',
      plugins: [prettierPluginBabel, prettierPluginEstree],
      tabWidth: indentSize,
      printWidth: 100,
      singleQuote: true
    })

    return formatted
  } catch (error) {
    console.error('Error formatting JavaScript:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to format JavaScript: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to format JavaScript: ${error}`)
    } else {
      throw new Error('Failed to format JavaScript: Unknown error')
    }
  }
}

export default jsFormat
