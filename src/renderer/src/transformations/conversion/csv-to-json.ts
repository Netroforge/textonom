import type { TransformationFunction } from '../../types'
import { TransformationParamValues } from '../../types/transformation'

/**
 * Converts CSV text to JSON
 * @param text - The CSV text to convert
 * @param params - Parameters for CSV to JSON conversion
 * @param params.delimiter - The delimiter character (default: ',')
 * @param params.hasHeader - Whether the CSV has a header row (default: true)
 * @returns The JSON representation of the CSV data
 * @throws Error if conversion fails
 */
const csvToJson: TransformationFunction = async (
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
    const hasHeader = params?.hasHeader !== false // Default to true

    // Split the CSV into lines
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')

    if (lines.length === 0) {
      return '[]'
    }

    // Parse CSV
    let headers: string[] = []
    let startRow = 0

    if (hasHeader) {
      // Use the first row as headers
      headers = parseCSVLine(lines[0], delimiter)
      startRow = 1
    }

    const result: Record<string, string>[] = []

    for (let i = startRow; i < lines.length; i++) {
      const values = parseCSVLine(lines[i], delimiter)

      if (hasHeader) {
        // Create an object with header keys
        const obj: Record<string, string> = {}
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = j < values.length ? values[j] : ''
        }
        result.push(obj)
      } else {
        // Without headers, just use array indices as keys
        const obj: Record<string, string> = {}
        for (let j = 0; j < values.length; j++) {
          obj[`column${j + 1}`] = values[j]
        }
        result.push(obj)
      }
    }

    // Format the result as JSON with 2-space indentation
    return JSON.stringify(result, null, 2)
  } catch (error) {
    console.error('Error converting CSV to JSON:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to convert CSV to JSON: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to convert CSV to JSON: ${error}`)
    } else {
      throw new Error('Failed to convert CSV to JSON: Unknown error')
    }
  }
}

/**
 * Parse a CSV line, handling quoted values
 * @param line - The CSV line to parse
 * @param delimiter - The delimiter character
 * @returns Array of values from the line
 */
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = i < line.length - 1 ? line[i + 1] : null

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Handle escaped quotes (two double quotes in a row)
        current += '"'
        i++ // Skip the next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      result.push(current)
      current = ''
    } else {
      // Add character to current field
      current += char
    }
  }

  // Add the last field
  result.push(current)
  return result
}

export default csvToJson
