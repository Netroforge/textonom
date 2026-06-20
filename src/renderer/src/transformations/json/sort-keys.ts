import type { TransformationFunction } from '../../types/transformation'

/**
 * Recursively sorts object keys alphabetically and re-serializes the JSON with
 * 2-space indentation. Array order is preserved.
 */
const sortJsonKeys: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(sortValue(parsed), null, 2)
  } catch {
    throw new Error('Failed to sort JSON keys: Invalid JSON format')
  }
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue)
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortValue((value as Record<string, unknown>)[key])
    }
    return sorted
  }
  return value
}

export default sortJsonKeys
