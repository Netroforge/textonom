import * as yaml from 'js-yaml'
import type { TransformationFunction } from '../../types'

/**
 * Converts Java properties file format to YAML
 */
const propertiesFileToYaml: TransformationFunction = async (text: string): Promise<string> => {
  try {
    if (!text) return ''
    // Handle different types of newlines (CR, LF, CRLF)
    const lines = text.split(/\r\n|\r|\n/)
    const result: Record<string, unknown> = {}

    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '') {
        continue
      }

      const separatorIndex = line.indexOf('=')
      if (separatorIndex > 0) {
        const key = line.substring(0, separatorIndex).trim()
        const value = line.substring(separatorIndex + 1).trim()

        // Handle nested properties
        const keyParts = key.split('.')
        let current = result

        for (let i = 0; i < keyParts.length - 1; i++) {
          const part = keyParts[i]
          if (!current[part]) {
            current[part] = {} as Record<string, unknown>
          }
          current = current[part] as Record<string, unknown>
        }

        // Set the value for the last key part
        current[keyParts[keyParts.length - 1]] = value
      }
    }

    return yaml.dump(result)
  } catch (error) {
    console.error('Error converting properties to YAML:', error)
    const err = error as Error
    throw new Error('Failed to convert properties to YAML: ' + err.message)
  }
}

export default propertiesFileToYaml
