import * as prettier from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginHtml from 'prettier/plugins/html'
import * as prettierPluginCss from 'prettier/plugins/postcss'
import * as prettierPluginXml from '@prettier/plugin-xml'
import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Formats code (HTML, CSS, JavaScript, XML) with proper indentation
 * @param text - The code to format
 * @param params - Parameters for code formatting
 * @param params.language - Language of the code (html, css, js, xml)
 * @param params.indentSize - Number of spaces for indentation (default: 2)
 * @returns The formatted code
 * @throws Error if formatting fails
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

    // Determine parser based on language
    let parser: string
    switch (language.toLowerCase()) {
      case 'html':
        parser = 'html'
        break
      case 'css':
        parser = 'css'
        break
      case 'js':
      case 'javascript':
        parser = 'babel'
        break
      case 'xml':
        parser = 'xml'
        break
      default:
        throw new Error(`Unsupported language: ${language}`)
    }

    // Format the code
    const formatted = await prettier.format(text, {
      parser,
      plugins: [
        prettierPluginBabel,
        prettierPluginEstree,
        prettierPluginHtml,
        prettierPluginCss,
        prettierPluginXml
      ],
      tabWidth: indentSize,
      printWidth: 100,
      singleQuote: true
    })

    return formatted
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
