import * as yaml from 'js-yaml'
import type { TransformationFunction } from '../../types'

/**
 * Converts JSON to YAML format
 */
const jsonToYaml: TransformationFunction = async (text: string): Promise<string> => {
  try {
    const parsed = JSON.parse(text)
    return yaml.dump(parsed)
  } catch (error) {
    console.error('Error converting JSON to YAML:', error)
    throw new Error('Failed to convert JSON to YAML: Invalid JSON format')
  }
}

export default jsonToYaml
