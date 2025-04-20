import type { TransformationFunction } from '../../types'

/**
 * Formats JSON with proper indentation
 */
const jsonPrettify: TransformationFunction = async (text: string): Promise<string> => {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    console.error('Error prettifying JSON:', error)
    throw new Error('Failed to prettify JSON: Invalid JSON format')
  }
}

export default jsonPrettify
