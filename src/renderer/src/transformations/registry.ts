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
