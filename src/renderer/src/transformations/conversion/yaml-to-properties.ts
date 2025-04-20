import * as yaml from 'js-yaml'
import type { TransformationFunction } from '../../types'

/**
 * Converts YAML to Java properties file format
 */
const yamlToPropertiesFile: TransformationFunction = async (text: string): Promise<string> => {
  try {
    const parsed = yaml.load(text) as Record<string, unknown>
    const lines: string[] = []

    // Recursive function to flatten nested objects
    const flattenObject = (obj: Record<string, unknown>, prefix = ''): void => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          flattenObject(obj[key] as Record<string, unknown>, prefix + key + '.')
        } else {
          lines.push(prefix + key + '=' + obj[key])
        }
      }
    }

    flattenObject(parsed)
    return lines.join('\n')
  } catch (error) {
    console.error('Error converting YAML to properties:', error)
    const err = error as Error
    throw new Error('Failed to convert YAML to properties: ' + err.message)
  }
}

export default yamlToPropertiesFile
