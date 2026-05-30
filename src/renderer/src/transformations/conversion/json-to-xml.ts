import { XMLBuilder } from 'fast-xml-parser'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts JSON to XML format with indentation
 */
const jsonToXml: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Failed to convert JSON to XML: Invalid JSON format')
  }

  try {
    const builder = new XMLBuilder({
      format: true,
      indentBy: '  ',
      ignoreAttributes: false
    })
    return builder.build(parsed).trimEnd()
  } catch (error) {
    const err = error as Error
    throw new Error('Failed to convert JSON to XML: ' + err.message)
  }
}

export default jsonToXml
