import { Transformation, TransformationCategory } from '../types/transformation'
import transformations from './index'
import { getCustomTransformations, initializeCustomTransformations } from './index'
import type { CustomTransformation } from './custom'

// Initialize custom transformations at module load
initializeCustomTransformations()

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
  },
  {
    id: 'generators',
    name: 'Generators',
    description: 'Generate IDs, placeholder text, and other useful values',
    transformations: []
  },
  {
    id: 'pipeline',
    name: 'Pipeline / Batch',
    description: 'Chain multiple transformations together for complex workflows',
    transformations: []
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Create and manage your own custom transformations',
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
    id: 'pbkdf2Hash',
    name: 'PBKDF2 Hash',
    description: 'Derive a key from text using PBKDF2 with HMAC',
    category: 'hash',
    parameters: [
      {
        name: 'algorithm',
        type: 'string',
        description: 'HMAC hash algorithm (SHA1, SHA256, SHA512)',
        default: 'SHA256'
      },
      {
        name: 'iterations',
        type: 'number',
        description: 'Number of iterations',
        default: 100000,
        min: 1,
        max: 1000000
      },
      {
        name: 'keyLength',
        type: 'number',
        description: 'Derived key length in bytes',
        default: 32,
        min: 8,
        max: 128
      },
      {
        name: 'salt',
        type: 'string',
        description: 'Salt (leave empty for a random 16-byte salt)',
        default: ''
      }
    ],
    fn: transformations.pbkdf2Hash
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
  },

  // Text
  {
    id: 'slugify',
    name: 'Slugify',
    description: 'Convert text to a URL-friendly slug',
    category: 'text',
    fn: transformations.slugify
  },

  // Generators
  {
    id: 'uuidGenerate',
    name: 'UUID Generator',
    description: 'Generate one or more random UUIDs (v4)',
    category: 'generators',
    parameters: [
      {
        name: 'count',
        type: 'number',
        description: 'Number of UUIDs to generate',
        default: 1,
        min: 1,
        max: 1000
      },
      {
        name: 'uppercase',
        type: 'boolean',
        description: 'Output in uppercase',
        default: false
      }
    ],
    fn: transformations.uuidGenerate
  },
  {
    id: 'loremGenerate',
    name: 'Lorem Ipsum',
    description: 'Generate placeholder lorem ipsum text',
    category: 'generators',
    parameters: [
      {
        name: 'unit',
        type: 'string',
        description: 'paragraphs, sentences, or words',
        default: 'paragraphs'
      },
      {
        name: 'count',
        type: 'number',
        description: 'How many to generate',
        default: 3,
        min: 1,
        max: 100
      }
    ],
    fn: transformations.loremGenerate
  },

  // Conversion (continued)
  {
    id: 'timestampToIso',
    name: 'Unix Timestamp to ISO',
    description: 'Convert Unix timestamps (seconds or milliseconds) to ISO 8601',
    category: 'conversion',
    fn: transformations.timestampToIso
  },
  {
    id: 'isoToTimestamp',
    name: 'ISO to Unix Timestamp',
    description: 'Convert ISO 8601 dates to Unix timestamps',
    category: 'conversion',
    parameters: [
      {
        name: 'unit',
        type: 'string',
        description: 'Output unit: seconds or milliseconds',
        default: 'seconds'
      }
    ],
    fn: transformations.isoToTimestamp
  },
  {
    id: 'colorConvert',
    name: 'Color Converter',
    description: 'Convert colors between hex, rgb(), and hsl() (one per line)',
    category: 'conversion',
    fn: transformations.colorConvert
  },
  {
    id: 'baseConvert',
    name: 'Number Base Converter',
    description: 'Convert numbers between binary, octal, decimal, and hex',
    category: 'conversion',
    parameters: [
      {
        name: 'fromBase',
        type: 'number',
        description: 'Input base (2, 8, 10, 16)',
        default: 10
      },
      {
        name: 'toBase',
        type: 'number',
        description: 'Output base (2, 8, 10, 16)',
        default: 16
      }
    ],
    fn: transformations.baseConvert
  },

  // AES
  {
    id: 'aesEncrypt',
    name: 'AES Encrypt',
    description: 'Encrypt text using AES (Advanced Encryption Standard)',
    category: 'encoding',
    parameters: [
      {
        name: 'key',
        type: 'string',
        description: 'Secret encryption key'
      },
      {
        name: 'output',
        type: 'string',
        description: 'Output format (base64 or hex)',
        default: 'base64'
      }
    ],
    fn: transformations.aesEncrypt
  },
  {
    id: 'aesDecrypt',
    name: 'AES Decrypt',
    description: 'Decrypt AES-encrypted text back to plain text',
    category: 'encoding',
    parameters: [
      {
        name: 'key',
        type: 'string',
        description: 'Secret decryption key'
      },
      {
        name: 'output',
        type: 'string',
        description: 'Output format (base64 or hex)',
        default: 'base64'
      }
    ],
    fn: transformations.aesDecrypt
  },

  // Regex
  {
    id: 'regexReplace',
    name: 'Regex Find & Replace',
    description: 'Search and replace text using regular expressions',
    category: 'text',
    parameters: [
      {
        name: 'pattern',
        type: 'string',
        description: 'Regular expression pattern'
      },
      {
        name: 'replacement',
        type: 'string',
        description: 'Replacement string',
        default: ''
      },
      {
        name: 'flags',
        type: 'string',
        description: 'Regex flags (g, i, m, etc.)',
        default: 'g'
      }
    ],
    fn: transformations.regexReplace
  },

  // Base32
  {
    id: 'base32Encode',
    name: 'Base32 Encode',
    description: 'Encode text to Base32 (RFC 4648)',
    category: 'encoding',
    fn: transformations.base32Encode
  },
  {
    id: 'base32Decode',
    name: 'Base32 Decode',
    description: 'Decode Base32 (RFC 4648) encoded text',
    category: 'encoding',
    fn: transformations.base32Decode
  },

  // Binary
  {
    id: 'binaryEncode',
    name: 'Text to Binary',
    description: 'Encode text to a string of 8-bit binary bytes',
    category: 'encoding',
    fn: transformations.binaryEncode
  },
  {
    id: 'binaryDecode',
    name: 'Binary to Text',
    description: 'Decode a string of binary bytes back to text',
    category: 'encoding',
    fn: transformations.binaryDecode
  },

  // Morse code
  {
    id: 'morseEncode',
    name: 'Text to Morse Code',
    description: 'Encode text to International Morse code',
    category: 'encoding',
    fn: transformations.morseEncode
  },
  {
    id: 'morseDecode',
    name: 'Morse Code to Text',
    description: 'Decode International Morse code back to text',
    category: 'encoding',
    fn: transformations.morseDecode
  },

  // Hash (additional)
  {
    id: 'sha3Hash',
    name: 'SHA-3 Hash',
    description: 'Generate a SHA-3 (Keccak) hash of text',
    category: 'hash',
    parameters: [
      {
        name: 'outputLength',
        type: 'number',
        description: 'Digest length in bits (224, 256, 384, or 512)',
        default: 512
      }
    ],
    fn: transformations.sha3Hash
  },
  {
    id: 'ripemd160Hash',
    name: 'RIPEMD-160 Hash',
    description: 'Generate a RIPEMD-160 hash of text',
    category: 'hash',
    fn: transformations.ripemd160Hash
  },

  // Text (additional)
  {
    id: 'reverseString',
    name: 'Reverse Text',
    description: 'Reverse the characters in the text',
    category: 'text',
    fn: transformations.reverseString
  },
  {
    id: 'textStatistics',
    name: 'Text Statistics',
    description: 'Count characters, words, lines, bytes, and estimate reading time',
    category: 'text',
    fn: transformations.textStatistics
  },
  {
    id: 'rot13',
    name: 'ROT13',
    description: 'Apply the ROT13 substitution cipher (run twice to decode)',
    category: 'text',
    fn: transformations.rot13
  },
  {
    id: 'caesarCipher',
    name: 'Caesar Cipher',
    description: 'Shift letters by a fixed amount (use a negative shift to decode)',
    category: 'text',
    parameters: [
      {
        name: 'shift',
        type: 'number',
        description: 'Number of positions to shift',
        default: 3
      }
    ],
    fn: transformations.caesarCipher
  },
  {
    id: 'natoAlphabet',
    name: 'NATO Phonetic Alphabet',
    description: 'Spell out text using the NATO phonetic alphabet',
    category: 'text',
    fn: transformations.natoAlphabet
  },
  {
    id: 'stripHtmlTags',
    name: 'Strip HTML Tags',
    description: 'Remove HTML tags, leaving the plain text content',
    category: 'text',
    fn: transformations.stripHtmlTags
  },
  {
    id: 'tabsToSpaces',
    name: 'Tabs to Spaces',
    description: 'Replace tab characters with spaces',
    category: 'text',
    parameters: [
      {
        name: 'tabSize',
        type: 'number',
        description: 'Number of spaces per tab',
        default: 4,
        min: 1,
        max: 16
      }
    ],
    fn: transformations.tabsToSpaces
  },
  {
    id: 'spacesToTabs',
    name: 'Spaces to Tabs',
    description: 'Convert leading spaces (indentation) to tab characters',
    category: 'text',
    parameters: [
      {
        name: 'tabSize',
        type: 'number',
        description: 'Number of spaces that make up one tab',
        default: 4,
        min: 1,
        max: 16
      }
    ],
    fn: transformations.spacesToTabs
  },
  {
    id: 'trimLines',
    name: 'Trim Trailing Whitespace',
    description: 'Remove trailing whitespace from the end of every line',
    category: 'text',
    fn: transformations.trimLines
  },

  // Formatting (additional)
  {
    id: 'sortJsonKeys',
    name: 'Sort JSON Keys',
    description: 'Recursively sort object keys alphabetically',
    category: 'formatting',
    fn: transformations.sortJsonKeys
  },

  // Conversion (additional)
  {
    id: 'jsonToToml',
    name: 'JSON to TOML',
    description: 'Convert JSON to TOML format',
    category: 'conversion',
    fn: transformations.jsonToToml
  },
  {
    id: 'tomlToJson',
    name: 'TOML to JSON',
    description: 'Convert TOML to JSON format',
    category: 'conversion',
    fn: transformations.tomlToJson
  },
  {
    id: 'yamlToToml',
    name: 'YAML to TOML',
    description: 'Convert YAML to TOML format',
    category: 'conversion',
    fn: transformations.yamlToToml
  },
  {
    id: 'tomlToYaml',
    name: 'TOML to YAML',
    description: 'Convert TOML to YAML format',
    category: 'conversion',
    fn: transformations.tomlToYaml
  },
  {
    id: 'jsonToXml',
    name: 'JSON to XML',
    description: 'Convert JSON to XML format',
    category: 'conversion',
    fn: transformations.jsonToXml
  },
  {
    id: 'xmlToJson',
    name: 'XML to JSON',
    description: 'Convert XML to JSON format',
    category: 'conversion',
    fn: transformations.xmlToJson
  },
  {
    id: 'htmlToMarkdown',
    name: 'HTML to Markdown',
    description: 'Convert HTML to Markdown',
    category: 'conversion',
    fn: transformations.htmlToMarkdown
  },
  {
    id: 'queryStringToJson',
    name: 'Query String to JSON',
    description: 'Parse a URL query string into JSON',
    category: 'conversion',
    fn: transformations.queryStringToJson
  },
  {
    id: 'jsonToQueryString',
    name: 'JSON to Query String',
    description: 'Convert a flat JSON object into a URL query string',
    category: 'conversion',
    fn: transformations.jsonToQueryString
  },
  {
    id: 'romanToNumber',
    name: 'Roman Numerals to Number',
    description: 'Convert Roman numerals (one per line) to integers',
    category: 'conversion',
    fn: transformations.romanToNumber
  },
  {
    id: 'numberToRoman',
    name: 'Number to Roman Numerals',
    description: 'Convert integers (1-3999, one per line) to Roman numerals',
    category: 'conversion',
    fn: transformations.numberToRoman
  },
  {
    id: 'cronToHuman',
    name: 'Cron to Human-readable',
    description: 'Describe cron expressions (one per line) in plain English',
    category: 'conversion',
    fn: transformations.cronToHuman
  },

  // Generators (additional)
  {
    id: 'ulidGenerate',
    name: 'ULID Generator',
    description: 'Generate one or more ULIDs (sortable unique identifiers)',
    category: 'generators',
    parameters: [
      {
        name: 'count',
        type: 'number',
        description: 'Number of ULIDs to generate',
        default: 1,
        min: 1,
        max: 1000
      }
    ],
    fn: transformations.ulidGenerate
  },
  {
    id: 'tokenGenerate',
    name: 'Token / Password Generator',
    description: 'Generate a random token from the selected character sets',
    category: 'generators',
    parameters: [
      {
        name: 'length',
        type: 'number',
        description: 'Token length',
        default: 32,
        min: 1,
        max: 1024
      },
      {
        name: 'uppercase',
        type: 'boolean',
        description: 'Include uppercase letters (A-Z)',
        default: true
      },
      {
        name: 'lowercase',
        type: 'boolean',
        description: 'Include lowercase letters (a-z)',
        default: true
      },
      {
        name: 'numbers',
        type: 'boolean',
        description: 'Include digits (0-9)',
        default: true
      },
      {
        name: 'symbols',
        type: 'boolean',
        description: 'Include symbols',
        default: false
      }
    ],
    fn: transformations.tokenGenerate
  },
  // Pipeline
  {
    id: 'pipelineTransform',
    name: 'Pipeline Transform',
    description:
      'Chain multiple transformations together in sequence to create complex text processing workflows',
    category: 'pipeline',
    parameters: [
      {
        name: 'pipeline',
        type: 'string',
        description: 'Pipeline configuration (JSON)'
      }
    ],
    fn: transformations.pipelineTransform
  },
  // Custom Transformation Builder
  {
    id: 'customTransformationBuilder',
    name: 'Custom Transformation Builder',
    description: 'Create your own custom text transformations with a visual builder',
    category: 'custom',
    fn: transformations.customTransformationBuilder
  }
]
// Add custom transformations from the transformations object
const addCustomTransformationsToRegistry = (): void => {
  const customIds = Object.keys(transformations).filter((key) => key.startsWith('custom_'))
  for (const id of customIds) {
    const fn = transformations[id]
    if (fn) {
      // Find the custom transformation in localStorage to get metadata
      const customTransforms = getCustomTransformations ? getCustomTransformations() : []
      const custom = customTransforms.find((c: CustomTransformation) => c.id === id)
      if (custom) {
        const metadata: Transformation = {
          id: custom.id,
          name: custom.name,
          description: custom.description,
          category: custom.category,
          parameters: custom.parameters,
          fn
        }
        transformationMetadata.push(metadata)
        const category = categories.find((cat) => cat.id === custom.category)
        if (category) {
          category.transformations.push(metadata)
        }
      }
    }
  }
}

// Organize transformations into categories
transformationMetadata.forEach((transformation) => {
  const category = categories.find((cat) => cat.id === transformation.category)
  if (category) {
    category.transformations.push(transformation)
  }
})

// Add custom transformations after initial setup
addCustomTransformationsToRegistry()

// Get all transformations
export const getAllTransformations = (): Transformation[] => {
  // Refresh custom transformations
  addCustomTransformationsToRegistry()
  return transformationMetadata
}

// Get transformation by ID
export const getTransformationById = (id: string): Transformation | undefined => {
  // Check static metadata first
  let result = transformationMetadata.find((t) => t.id === id)
  // Check custom transformations
  if (!result && id.startsWith('custom_')) {
    const customTransforms = getCustomTransformations ? getCustomTransformations() : []
    const custom = customTransforms.find((c: CustomTransformation) => c.id === id)
    if (custom && transformations[id]) {
      result = {
        id: custom.id,
        name: custom.name,
        description: custom.description,
        category: custom.category,
        parameters: custom.parameters,
        fn: transformations[id]
      }
    }
  }
  return result
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
