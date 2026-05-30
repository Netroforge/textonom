import { stringify as tomlStringify } from 'smol-toml'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts JSON to TOML format
 */
const jsonToToml: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Failed to convert JSON to TOML: Invalid JSON format')
  }

  try {
    return tomlStringify(parsed as Record<string, unknown>)
  } catch (error) {
    const err = error as Error
    throw new Error('Failed to convert JSON to TOML: ' + err.message)
  }
}

export default jsonToToml
