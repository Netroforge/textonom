import { JSONPath } from 'jsonpath-plus'
import type { TransformationFunction, TransformationParamValues } from '../../types/transformation'

const jsonPathQuery: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text.trim() === '') return ''

  const path = String(params?.path ?? '$')
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('Input must be valid JSON')
  }

  try {
    const matches = JSONPath<unknown[]>({
      path,
      json: json as null | boolean | number | string | object | unknown[],
      eval: 'safe',
      wrap: true
    })
    return JSON.stringify(
      {
        path,
        count: matches.length,
        matches
      },
      null,
      2
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Invalid JSONPath expression: ${message}`)
  }
}

export default jsonPathQuery
