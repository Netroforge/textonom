import type { TransformationFunction } from '../../types/transformation'

/**
 * Parses a URL query string into JSON. A leading "?" (or a full URL) is
 * accepted. Repeated keys are collected into an array.
 */
const queryStringToJson: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    let query = text.trim()
    const questionMark = query.indexOf('?')
    if (questionMark !== -1) {
      query = query.slice(questionMark + 1)
    }
    query = query.replace(/^[?&]+/, '')

    const params = new URLSearchParams(query)
    const result: Record<string, string | string[]> = {}

    for (const key of new Set(params.keys())) {
      const values = params.getAll(key)
      result[key] = values.length > 1 ? values : values[0]
    }

    return JSON.stringify(result, null, 2)
  } catch (error) {
    console.error('Error converting query string to JSON:', error)
    const err = error as Error
    throw new Error('Failed to convert query string to JSON: ' + err.message)
  }
}

export default queryStringToJson
