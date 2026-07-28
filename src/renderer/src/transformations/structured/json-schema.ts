import Ajv2020, { type ErrorObject } from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import type { TransformationFunction, TransformationParamValues } from '../../types/transformation'

const formatError = (error: ErrorObject): Record<string, unknown> => ({
  instancePath: error.instancePath || '/',
  schemaPath: error.schemaPath,
  keyword: error.keyword,
  message: error.message ?? 'Validation failed',
  params: error.params
})

const jsonSchemaValidate: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text.trim() === '') return ''

  const schemaText = String(params?.schema ?? '').trim()
  if (!schemaText) {
    throw new Error('A JSON Schema is required')
  }

  let data: unknown
  let schema: object
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Input must be valid JSON')
  }
  try {
    schema = JSON.parse(schemaText) as object
  } catch {
    throw new Error('Schema must be valid JSON')
  }

  try {
    const ajv = new Ajv2020({
      allErrors: true,
      strict: false,
      validateFormats: true
    })
    addFormats(ajv)
    const validate = ajv.compile(schema)
    const valid = validate(data)

    return JSON.stringify(
      {
        valid,
        errors: valid ? [] : (validate.errors ?? []).map(formatError)
      },
      null,
      2
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Invalid JSON Schema: ${message}`)
  }
}

export default jsonSchemaValidate
