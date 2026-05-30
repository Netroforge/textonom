import { XMLParser, XMLValidator } from 'fast-xml-parser'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts XML to JSON format
 */
const xmlToJson: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    const validation = XMLValidator.validate(text)
    if (validation !== true) {
      throw new Error(validation.err.msg)
    }

    const parser = new XMLParser({ ignoreAttributes: false })
    const parsed = parser.parse(text)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    console.error('Error converting XML to JSON:', error)
    const err = error as Error
    throw new Error('Failed to convert XML to JSON: ' + err.message)
  }
}

export default xmlToJson
