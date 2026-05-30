import * as yaml from 'js-yaml'
import { stringify as tomlStringify } from 'smol-toml'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts YAML to TOML format
 */
const yamlToToml: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  let parsed: unknown
  try {
    parsed = yaml.load(text)
  } catch {
    throw new Error('Failed to convert YAML to TOML: Invalid YAML format')
  }

  try {
    return tomlStringify(parsed as Record<string, unknown>)
  } catch (error) {
    const err = error as Error
    throw new Error('Failed to convert YAML to TOML: ' + err.message)
  }
}

export default yamlToToml
