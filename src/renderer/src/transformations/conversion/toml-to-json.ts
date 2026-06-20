import { parse as tomlParse } from 'smol-toml'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts TOML to JSON format
 */
const tomlToJson: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    const parsed = tomlParse(text)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    const err = error as Error
    throw new Error('Failed to convert TOML to JSON: ' + err.message)
  }
}

export default tomlToJson
