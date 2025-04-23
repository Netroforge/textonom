import * as prettier from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginHtml from 'prettier/plugins/html'
import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Formats HTML code with proper indentation
 * @param text - The HTML code to format
 * @param params - Parameters for HTML formatting
 * @param params.indentSize - Number of spaces for indentation (default: 2)
 * @returns The formatted HTML code
 * @throws Error if formatting fails
 */
const htmlFormat: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Get parameters with defaults
    const indentSize = Number(params?.indentSize ?? 2)

    // Format the HTML code
    const formatted = await prettier.format(text, {
      parser: 'html',
      plugins: [prettierPluginBabel, prettierPluginEstree, prettierPluginHtml],
      tabWidth: indentSize,
      printWidth: 100,
      singleQuote: true
    })

    return formatted
  } catch (error) {
    console.error('Error formatting HTML:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to format HTML: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to format HTML: ${error}`)
    } else {
      throw new Error('Failed to format HTML: Unknown error')
    }
  }
}

export default htmlFormat
