import { Transformation, TransformationCategory } from '../types/transformation'
import transformations from './index'

// Define categories
const categories: TransformationCategory[] = [
  {
    id: 'encoding',
    name: 'Encoding & Decoding',
    description: 'Encode or decode text using various algorithms',
    transformations: []
  },
  {
    id: 'formatting',
    name: 'Formatting',
    description: 'Format and prettify various data formats',
    transformations: []
  },
  {
    id: 'case',
    name: 'Case Conversion',
    description: 'Convert text case (uppercase, lowercase, etc.)',
    transformations: []
  },
  {
    id: 'text',
    name: 'Text Operations',
    description: 'Various text manipulation operations',
    transformations: []
  },
  {
    id: 'hash',
    name: 'Hashing',
    description: 'Generate cryptographic hashes',
    transformations: []
  },
  {
    id: 'conversion',
    name: 'Format Conversion',
    description: 'Convert between different data formats',
    transformations: []
  }
]

// Define transformation metadata
const transformationMetadata: Transformation[] = [
  // Base64
  {
    id: 'base64Encode',
    name: 'Base64 Encode',
    description: 'Encode text to Base64 format',
    category: 'encoding',
    fn: transformations.base64Encode
  },
  {
    id: 'base64Decode',
    name: 'Base64 Decode',
    description: 'Decode Base64 encoded text',
    category: 'encoding',
    fn: transformations.base64Decode
  },

  // JSON
  {
    id: 'jsonPrettify',
    name: 'JSON Prettify',
    description: 'Format JSON with proper indentation',
    category: 'formatting',
    fn: transformations.jsonPrettify
  },
  {
    id: 'jsonCompact',
    name: 'JSON Compact',
    description: 'Compact JSON by removing whitespace',
    category: 'formatting',
    fn: transformations.jsonCompact
  },

  // URL
  {
    id: 'urlEncode',
    name: 'URL Encode',
    description: 'Encode text for use in URLs',
    category: 'encoding',
    fn: transformations.urlEncode
  },
  {
    id: 'urlDecode',
    name: 'URL Decode',
    description: 'Decode URL encoded text',
    category: 'encoding',
    fn: transformations.urlDecode
  },

  // Case
  {
    id: 'toUpperCase',
    name: 'To Uppercase',
    description: 'Convert text to uppercase',
    category: 'case',
    fn: transformations.toUpperCase
  },
  {
    id: 'toLowerCase',
    name: 'To Lowercase',
    description: 'Convert text to lowercase',
    category: 'case',
    fn: transformations.toLowerCase
  },
  {
    id: 'toTitleCase',
    name: 'To Title Case',
    description: 'Convert text to title case (first letter of each word capitalized)',
    category: 'case',
    fn: transformations.toTitleCase
  },
  {
    id: 'toSnakeCase',
    name: 'To snake_case',
    description: 'Convert text to snake_case (lowercase with underscores)',
    category: 'case',
    fn: transformations.toSnakeCase
  },
  {
    id: 'toCamelCase',
    name: 'To camelCase',
    description: 'Convert text to camelCase (no spaces, first word lowercase, others capitalized)',
    category: 'case',
    fn: transformations.toCamelCase
  },
  {
    id: 'toKebabCase',
    name: 'To kebab-case',
    description: 'Convert text to kebab-case (lowercase with hyphens)',
    category: 'case',
    fn: transformations.toKebabCase
  },

  // XML
  {
    id: 'xmlPrettify',
    name: 'XML Prettify',
    description: 'Format XML with proper indentation',
    category: 'formatting',
    fn: transformations.xmlPrettify
  },
  {
    id: 'xmlCompact',
    name: 'XML Compact',
    description: 'Compact XML by removing whitespace',
    category: 'formatting',
    fn: transformations.xmlCompact
  },

  // Lines
  {
    id: 'sortLines',
    name: 'Sort Lines',
    description: 'Sort lines alphabetically',
    category: 'text',
    fn: transformations.sortLines
  },
  {
    id: 'deduplicateLines',
    name: 'Deduplicate Lines',
    description: 'Remove duplicate lines',
    category: 'text',
    fn: transformations.deduplicateLines
  },
  {
    id: 'reverseLines',
    name: 'Reverse Lines',
    description: 'Reverse the order of lines',
    category: 'text',
    fn: transformations.reverseLines
  },
  {
    id: 'removeEmptyLines',
    name: 'Remove Empty Lines',
    description: 'Remove all empty lines from text',
    category: 'text',
    fn: transformations.removeEmptyLines
  },
  {
    id: 'removeDuplicateWords',
    name: 'Remove Duplicate Words',
    description: 'Remove duplicate words from text (case-insensitive)',
    category: 'text',
    fn: transformations.removeDuplicateWords
  },

  // HTML
  {
    id: 'htmlEncode',
    name: 'HTML Encode',
    description: 'Encode special characters for HTML',
    category: 'encoding',
    fn: transformations.htmlEncode
  },
  {
    id: 'htmlDecode',
    name: 'HTML Decode',
    description: 'Decode HTML entities to characters',
    category: 'encoding',
    fn: transformations.htmlDecode
  },

  // Hash
  {
    id: 'md5Hash',
    name: 'MD5 Hash',
    description: 'Generate MD5 hash of text',
    category: 'hash',
    fn: transformations.md5Hash
  },
  {
    id: 'sha1Hash',
    name: 'SHA-1 Hash',
    description: 'Generate SHA-1 hash of text',
    category: 'hash',
    fn: transformations.sha1Hash
  },
  {
    id: 'sha256Hash',
    name: 'SHA-256 Hash',
    description: 'Generate SHA-256 hash of text',
    category: 'hash',
    fn: transformations.sha256Hash
  },
  {
    id: 'sha512Hash',
    name: 'SHA-512 Hash',
    description: 'Generate SHA-512 hash of text (stronger than SHA-256)',
    category: 'hash',
    fn: transformations.sha512Hash
  },
  {
    id: 'hmacHash',
    name: 'HMAC Hash',
    description: 'Generate HMAC (Hash-based Message Authentication Code) using various algorithms',
    category: 'hash',
    parameters: [
      {
        name: 'key',
        type: 'string',
        description: 'Secret key for HMAC generation'
      },
      {
        name: 'algorithm',
        type: 'string',
        description: 'Hash algorithm to use',
        default: 'SHA256'
      }
    ],
    fn: transformations.hmacHash
  },
  {
    id: 'argon2Hash',
    name: 'Argon2 Hash',
    description:
      'Generate Argon2-like hash of text (simulated using PBKDF2 for browser compatibility)',
    category: 'hash',
    parameters: [
      {
        name: 'type',
        type: 'number',
        description: 'Argon2 variant (0=argon2d, 1=argon2i, 2=argon2id)',
        default: 2
      },
      {
        name: 'memoryCost',
        type: 'number',
        description: 'Memory usage in KiB',
        default: 1024,
        min: 256,
        max: 4096
      },
      {
        name: 'timeCost',
        type: 'number',
        description: 'Number of iterations',
        default: 3,
        min: 1,
        max: 10
      },
      {
        name: 'parallelism',
        type: 'number',
        description: 'Degree of parallelism',
        default: 1,
        min: 1,
        max: 16
      }
    ],
    fn: transformations.argon2Hash
  },
  {
    id: 'bcryptHash',
    name: 'Bcrypt Hash',
    description: 'Generate Bcrypt hash of text',
    category: 'hash',
    parameters: [
      {
        name: 'rounds',
        type: 'number',
        description: 'Cost factor (rounds) for bcrypt hashing',
        default: 12,
        min: 1,
        max: 20
      }
    ],
    fn: transformations.bcryptHash
  },

  // Unicode
  {
    id: 'unicodeEscape',
    name: 'Unicode Escape',
    description: 'Escape Unicode characters to \\uXXXX format',
    category: 'encoding',
    fn: transformations.unicodeEscape
  },
  {
    id: 'unicodeUnescape',
    name: 'Unicode Unescape',
    description: 'Convert \\uXXXX format to actual Unicode characters',
    category: 'encoding',
    fn: transformations.unicodeUnescape
  },

  // Conversion
  {
    id: 'jsonToYaml',
    name: 'JSON to YAML',
    description: 'Convert JSON to YAML format',
    category: 'conversion',
    fn: transformations.jsonToYaml
  },
  {
    id: 'yamlToJson',
    name: 'YAML to JSON',
    description: 'Convert YAML to JSON format',
    category: 'conversion',
    fn: transformations.yamlToJson
  },
  {
    id: 'propertiesFileToYaml',
    name: 'Properties to YAML',
    description: 'Convert Java properties file to YAML',
    category: 'conversion',
    fn: transformations.propertiesFileToYaml
  },
  {
    id: 'yamlToPropertiesFile',
    name: 'YAML to Properties',
    description: 'Convert YAML to Java properties file format',
    category: 'conversion',
    fn: transformations.yamlToPropertiesFile
  },

  // JWT
  {
    id: 'jwtDecode',
    name: 'JWT Decode',
    description: 'Decode JSON Web Token (JWT) to view its contents',
    category: 'encoding',
    fn: transformations.jwtDecode
  },

  // Hex
  {
    id: 'hexEncode',
    name: 'Hex Encode',
    description: 'Encode text to hexadecimal representation',
    category: 'encoding',
    fn: transformations.hexEncode
  },
  {
    id: 'hexDecode',
    name: 'Hex Decode',
    description: 'Decode hexadecimal text to plain text',
    category: 'encoding',
    fn: transformations.hexDecode
  },

  // Markdown
  {
    id: 'markdownToHtml',
    name: 'Markdown to HTML',
    description: 'Convert Markdown text to HTML',
    category: 'conversion',
    fn: transformations.markdownToHtml
  },
  {
    id: 'csvToJson',
    name: 'CSV to JSON',
    description: 'Convert CSV data to JSON format',
    category: 'conversion',
    parameters: [
      {
        name: 'delimiter',
        type: 'string',
        description: 'The delimiter character',
        default: ','
      },
      {
        name: 'hasHeader',
        type: 'boolean',
        description: 'Whether the CSV has a header row',
        default: true
      }
    ],
    fn: transformations.csvToJson
  },
  {
    id: 'jsonToCsv',
    name: 'JSON to CSV',
    description: 'Convert JSON data to CSV format',
    category: 'conversion',
    parameters: [
      {
        name: 'delimiter',
        type: 'string',
        description: 'The delimiter character',
        default: ','
      },
      {
        name: 'includeHeader',
        type: 'boolean',
        description: 'Whether to include a header row',
        default: true
      }
    ],
    fn: transformations.jsonToCsv
  },

  // Formatting
  {
    id: 'sqlFormat',
    name: 'SQL Formatter',
    description: 'Format SQL queries with proper indentation and syntax',
    category: 'formatting',
    parameters: [
      {
        name: 'dialect',
        type: 'string',
        description: 'SQL dialect',
        default: 'sql'
      },
      {
        name: 'indentSize',
        type: 'number',
        description: 'Number of spaces for indentation',
        default: 2,
        min: 1,
        max: 8
      },
      {
        name: 'uppercase',
        type: 'boolean',
        description: 'Whether to uppercase keywords',
        default: false
      }
    ],
    fn: transformations.sqlFormat
  },
  {
    id: 'htmlFormat',
    name: 'HTML Formatter',
    description: 'Format HTML code with proper indentation',
    category: 'formatting',
    parameters: [
      {
        name: 'indentSize',
        type: 'number',
        description: 'Number of spaces for indentation',
        default: 2,
        min: 1,
        max: 8
      }
    ],
    fn: transformations.htmlFormat
  },
  {
    id: 'cssFormat',
    name: 'CSS Formatter',
    description: 'Format CSS code with proper indentation',
    category: 'formatting',
    parameters: [
      {
        name: 'indentSize',
        type: 'number',
        description: 'Number of spaces for indentation',
        default: 2,
        min: 1,
        max: 8
      }
    ],
    fn: transformations.cssFormat
  },
  {
    id: 'jsFormat',
    name: 'JavaScript Formatter',
    description: 'Format JavaScript code with proper indentation',
    category: 'formatting',
    parameters: [
      {
        name: 'indentSize',
        type: 'number',
        description: 'Number of spaces for indentation',
        default: 2,
        min: 1,
        max: 8
      }
    ],
    fn: transformations.jsFormat
  },
  {
    id: 'xmlFormat',
    name: 'XML Formatter',
    description: 'Format XML code with proper indentation',
    category: 'formatting',
    parameters: [
      {
        name: 'indentSize',
        type: 'number',
        description: 'Number of spaces for indentation',
        default: 2,
        min: 1,
        max: 8
      }
    ],
    fn: transformations.xmlFormat
  }
]

// Organize transformations into categories
transformationMetadata.forEach((transformation) => {
  const category = categories.find((cat) => cat.id === transformation.category)
  if (category) {
    category.transformations.push(transformation)
  }
})

// Get all transformations
export const getAllTransformations = (): Transformation[] => {
  return transformationMetadata
}

// Get transformation by ID
export const getTransformationById = (id: string): Transformation | undefined => {
  return transformationMetadata.find((t) => t.id === id)
}

// Get all categories with their transformations
export const getAllCategories = (): TransformationCategory[] => {
  return categories
}

// Get a specific category by ID
export const getCategoryById = (id: string): TransformationCategory | undefined => {
  return categories.find((cat) => cat.id === id)
}

// Search transformations by query
export const searchTransformations = (query: string): Transformation[] => {
  if (!query) return transformationMetadata

  const lowerQuery = query.toLowerCase()
  return transformationMetadata.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) || t.description.toLowerCase().includes(lowerQuery)
  )
}
