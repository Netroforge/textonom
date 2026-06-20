import * as yaml from 'js-yaml'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts YAML to JSON format
 */
const yamlToJson: TransformationFunction = async (text: string): Promise<string> => {
  try {
    const parsed = yaml.load(text) as object
    return JSON.stringify(parsed, null, 2)
  } catch {
    throw new Error('Failed to convert YAML to JSON: Invalid YAML format')
  }
}

export default yamlToJson
