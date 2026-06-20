import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts a flat JSON object into a URL query string. Array values are emitted
 * as repeated keys; objects are JSON-encoded.
 */
const jsonToQueryString: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    const data = JSON.parse(text)
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new Error('Input JSON must be an object')
    }

    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, stringify(item)))
      } else {
        params.append(key, stringify(value))
      }
    }

    return params.toString()
  } catch (error) {
    const err = error as Error
    throw new Error('Failed to convert JSON to query string: ' + err.message)
  }
}

function stringify(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export default jsonToQueryString
