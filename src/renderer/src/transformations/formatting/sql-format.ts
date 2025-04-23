import { format } from 'sql-formatter'
import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

// Define SQL dialect type based on sql-formatter's supported dialects
type SqlDialect =
  | 'sql'
  | 'mysql'
  | 'postgresql'
  | 'tsql'
  | 'plsql'
  | 'sqlite'
  | 'bigquery'
  | 'redshift'
  | 'spark'

/**
 * Formats SQL queries with proper indentation and syntax
 * @param text - The SQL query to format
 * @param params - Parameters for SQL formatting
 * @param params.dialect - SQL dialect (default: 'sql')
 * @param params.indentSize - Number of spaces for indentation (default: 2)
 * @param params.uppercase - Whether to uppercase keywords (default: false)
 * @returns The formatted SQL query
 * @throws Error if formatting fails
 */
const sqlFormat: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') {
    return ''
  }

  try {
    // Get parameters with defaults
    const dialect = (params?.dialect as string) || 'sql'
    const indentSize = Number(params?.indentSize ?? 2)
    const uppercase = params?.uppercase === true

    // Format the SQL query
    return format(text, {
      language: dialect as SqlDialect, // Type assertion with proper type
      tabWidth: indentSize,
      keywordCase: uppercase ? 'upper' : 'preserve',
      linesBetweenQueries: 2
    })
  } catch (error) {
    console.error('Error formatting SQL:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to format SQL: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to format SQL: ${error}`)
    } else {
      throw new Error('Failed to format SQL: Unknown error')
    }
  }
}

export default sqlFormat
