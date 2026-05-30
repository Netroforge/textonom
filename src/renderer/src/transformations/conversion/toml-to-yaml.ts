import * as yaml from 'js-yaml'
import { parse as tomlParse } from 'smol-toml'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts TOML to YAML format
 */
const tomlToYaml: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    const parsed = tomlParse(text)
    return yaml.dump(parsed)
  } catch (error) {
    console.error('Error converting TOML to YAML:', error)
    const err = error as Error
    throw new Error('Failed to convert TOML to YAML: ' + err.message)
  }
}

export default tomlToYaml
