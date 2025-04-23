import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Converts JSON to CSV format
 * @param text - The JSON text to convert
 * @param params - Parameters for JSON to CSV conversion
 * @param params.delimiter - The delimiter character (default: ',')
 * @param params.includeHeader - Whether to include a header row (default: true)
 * @returns The CSV representation of the JSON data
 * @throws Error if conversion fails
 */
const jsonToCsv: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  // Handle empty input
  if (text === '') {
    return ''
  }

  try {
    // Get parameters with defaults
    const delimiter = (params?.delimiter as string) || ','
    const includeHeader = params?.includeHeader !== false // Default to true

    // Parse JSON
    const data = JSON.parse(text)

    // Ensure data is an array
    if (!Array.isArray(data)) {
      throw new Error('Input JSON must be an array of objects')
    }

    if (data.length === 0) {
      return ''
    }

    // Get all unique keys from all objects
    const allKeys = new Set<string>()
    data.forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach((key) => allKeys.add(key))
      }
    })

    const keys = Array.from(allKeys)

    // Build CSV
    const lines: string[] = []

    // Add header row if requested
    if (includeHeader) {
      lines.push(keys.map((key) => escapeCSVValue(key, delimiter)).join(delimiter))
    }

    // Add data rows
    data.forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        const values = keys.map((key) => {
          const value = item[key]
          return escapeCSVValue(formatValue(value), delimiter)
        })
        lines.push(values.join(delimiter))
      }
    })

    return lines.join('\n')
  } catch (error) {
    console.error('Error converting JSON to CSV:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to convert JSON to CSV: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to convert JSON to CSV: ${error}`)
    } else {
      throw new Error('Failed to convert JSON to CSV: Unknown error')
    }
  }
}

/**
 * Format a value for CSV output
 * @param value - The value to format
 * @returns Formatted string value
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  } else if (typeof value === 'object') {
    return JSON.stringify(value)
  } else {
    return String(value)
  }
}

/**
 * Escape a value for CSV output
 * @param value - The value to escape
 * @param delimiter - The delimiter character
 * @returns Escaped string value
 */
function escapeCSVValue(value: string, delimiter: string): string {
  // If the value contains a delimiter, newline, or double quote, wrap it in quotes
  if (value.includes(delimiter) || value.includes('\n') || value.includes('"')) {
    // Escape any double quotes by doubling them
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export default jsonToCsv
