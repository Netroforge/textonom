import { Base64 } from 'js-base64'
import * as yaml from 'js-yaml'
import * as CryptoJS from 'crypto-js'
import * as bcrypt from 'bcryptjs'
import xmlFormat from 'xml-formatter'
import { useSettingsStore } from '../store/settingsStore'
import type { TransformationFunction } from '../types'

// Base64 transformations
export const base64Encode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return Base64.encode(text)
  } catch (error) {
    console.error('Error encoding to Base64:', error)
    throw new Error('Failed to encode text to Base64')
  }
}

export const base64Decode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return Base64.decode(text)
  } catch (error) {
    console.error('Error decoding from Base64:', error)
    throw new Error('Failed to decode Base64 text')
  }
}

// JSON transformations
export const jsonPrettify: TransformationFunction = async (text: string): Promise<string> => {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    console.error('Error prettifying JSON:', error)
    throw new Error('Failed to prettify JSON: Invalid JSON format')
  }
}

export const jsonCompact: TransformationFunction = async (text: string): Promise<string> => {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed)
  } catch (error) {
    console.error('Error compacting JSON:', error)
    throw new Error('Failed to compact JSON: Invalid JSON format')
  }
}

// URL transformations
export const urlEncode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return encodeURIComponent(text)
  } catch (error) {
    console.error('Error URL encoding:', error)
    throw new Error('Failed to URL encode text')
  }
}

export const urlDecode: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return decodeURIComponent(text)
  } catch (error) {
    console.error('Error URL decoding:', error)
    throw new Error('Failed to URL decode text')
  }
}

// Case transformations
export const toUpperCase: TransformationFunction = async (text: string): Promise<string> =>
  text.toUpperCase()
export const toLowerCase: TransformationFunction = async (text: string): Promise<string> =>
  text.toLowerCase()
export const toTitleCase: TransformationFunction = async (text: string): Promise<string> => {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// XML transformations
export const xmlPrettify: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return xmlFormat(text)
  } catch (error) {
    console.error('Error prettifying XML:', error)
    const err = error as Error
    throw new Error('Failed to prettify XML: ' + err.message)
  }
}

export const xmlCompact: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return xmlFormat.minify(text, {
      filter: (node) => node.type !== 'Comment',
      collapseContent: true
    })
  } catch (error) {
    console.error('Error compacting XML:', error)
    const err = error as Error
    throw new Error('Failed to compact XML: ' + err.message)
  }
}

// Line operations
export const sortLines: TransformationFunction = async (text: string): Promise<string> => {
  if (!text) return text
  // Handle different types of newlines (CR, LF, CRLF)
  const lines = text.split(/\r\n|\r|\n/)
  return lines.sort().join('\n')
}

export const deduplicateLines: TransformationFunction = async (text: string): Promise<string> => {
  if (!text) return text
  // Handle different types of newlines (CR, LF, CRLF)
  const lines = text.split(/\r\n|\r|\n/)
  return [...new Set(lines)].join('\n')
}

export const reverseLines: TransformationFunction = async (text: string): Promise<string> => {
  if (!text) return text
  // Handle different types of newlines (CR, LF, CRLF)
  const lines = text.split(/\r\n|\r|\n/)
  return lines.reverse().join('\n')
}

// HTML transformations
export const htmlEncode: TransformationFunction = async (text: string): Promise<string> => {
  const el = document.createElement('div')
  el.innerText = text
  return el.innerHTML
}

export const htmlDecode: TransformationFunction = async (text: string): Promise<string> => {
  const el = document.createElement('div')
  el.innerHTML = text
  return el.innerText
}

// Hash generation
export const md5Hash: TransformationFunction = async (text: string): Promise<string> => {
  return CryptoJS.MD5(text).toString()
}

export const sha1Hash: TransformationFunction = async (text: string): Promise<string> => {
  return CryptoJS.SHA1(text).toString()
}

export const sha256Hash: TransformationFunction = async (text: string): Promise<string> => {
  return CryptoJS.SHA256(text).toString()
}

export const bcryptHash: TransformationFunction = async (
  text: string,
  costFactor?: number
): Promise<string> => {
  // If no cost factor is provided, use the one from settings
  if (costFactor === undefined) {
    const settingsStore = useSettingsStore()
    costFactor = settingsStore.bcryptRounds
  }

  // Ensure the cost factor is within the allowed range (1-20)
  costFactor = Math.max(1, Math.min(20, Number(costFactor)))

  // Use the async version of bcrypt hash to prevent UI freezing
  // This wraps the callback-based hash in a Promise
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(text, costFactor, (err, hash) => {
      if (err) {
        reject(new Error('Failed to generate bcrypt hash: ' + err.message))
      } else {
        // Ensure hash is always a string
        resolve(hash || '')
      }
    })
  })
}

// Unicode escaping
export const unicodeEscape: TransformationFunction = async (text: string): Promise<string> => {
  return text.replace(/[\u007F-\uFFFF]/g, (char) => {
    return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4)
  })
}

export const unicodeUnescape: TransformationFunction = async (text: string): Promise<string> => {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16))
  })
}

// JSON to YAML conversion
export const jsonToYaml: TransformationFunction = async (text: string): Promise<string> => {
  try {
    const parsed = JSON.parse(text)
    return yaml.dump(parsed)
  } catch (error) {
    console.error('Error converting JSON to YAML:', error)
    throw new Error('Failed to convert JSON to YAML: Invalid JSON format')
  }
}

export const yamlToJson: TransformationFunction = async (text: string): Promise<string> => {
  try {
    const parsed = yaml.load(text) as object
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    console.error('Error converting YAML to JSON:', error)
    throw new Error('Failed to convert YAML to JSON: Invalid YAML format')
  }
}

// Spring Boot properties conversion
export const propertiesFileToYaml: TransformationFunction = async (
  text: string
): Promise<string> => {
  try {
    if (!text) return ''
    // Handle different types of newlines (CR, LF, CRLF)
    const lines = text.split(/\r\n|\r|\n/)
    const result: Record<string, any> = {}

    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '') {
        continue
      }

      const separatorIndex = line.indexOf('=')
      if (separatorIndex > 0) {
        const key = line.substring(0, separatorIndex).trim()
        const value = line.substring(separatorIndex + 1).trim()

        // Handle nested properties
        const keyParts = key.split('.')
        let current = result

        for (let i = 0; i < keyParts.length - 1; i++) {
          const part = keyParts[i]
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }

        // Set the value for the last key part
        current[keyParts[keyParts.length - 1]] = value
      }
    }

    return yaml.dump(result)
  } catch (error) {
    console.error('Error converting properties to YAML:', error)
    const err = error as Error
    throw new Error('Failed to convert properties to YAML: ' + err.message)
  }
}

export const yamlToPropertiesFile: TransformationFunction = async (
  text: string
): Promise<string> => {
  try {
    const parsed = yaml.load(text) as Record<string, any>
    const lines: string[] = []

    // Recursive function to flatten nested objects
    const flattenObject = (obj: Record<string, any>, prefix = '') => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          flattenObject(obj[key], prefix + key + '.')
        } else {
          lines.push(prefix + key + '=' + obj[key])
        }
      }
    }

    flattenObject(parsed)
    return lines.join('\n')
  } catch (error) {
    console.error('Error converting YAML to properties:', error)
    const err = error as Error
    throw new Error('Failed to convert YAML to properties: ' + err.message)
  }
}

// Export all transformations as a group
export const transformations = {
  base64Encode,
  base64Decode,
  jsonPrettify,
  jsonCompact,
  urlEncode,
  urlDecode,
  toUpperCase,
  toLowerCase,
  toTitleCase,
  xmlPrettify,
  xmlCompact,
  sortLines,
  deduplicateLines,
  reverseLines,
  htmlEncode,
  htmlDecode,
  md5Hash,
  sha1Hash,
  sha256Hash,
  bcryptHash,
  unicodeEscape,
  unicodeUnescape,
  jsonToYaml,
  yamlToJson,
  propertiesFileToYaml,
  yamlToPropertiesFile
}

// Also export as default for easier importing
export default transformations
