import yaml from 'js-yaml'
import xmlFormatter from 'xml-formatter'
import CryptoJS from 'crypto-js'
import bcrypt from 'bcryptjs'

// Base64 transformations
export const base64Encode = (text: string): string => {
  return Buffer.from(text).toString('base64')
}

export const base64Decode = (text: string): string => {
  try {
    return Buffer.from(text, 'base64').toString('utf-8')
  } catch {
    return 'Error: Invalid base64 string'
  }
}

// JSON transformations
export const jsonPrettify = (text: string): string => {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}

export const jsonCompact = (text: string): string => {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed)
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}

// URL transformations
export const urlEncode = (text: string): string => {
  return encodeURIComponent(text)
}

export const urlDecode = (text: string): string => {
  try {
    return decodeURIComponent(text)
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}

// Case transformations
export const toUpperCase = (text: string): string => {
  return text.toUpperCase()
}

export const toLowerCase = (text: string): string => {
  return text.toLowerCase()
}

export const toTitleCase = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// XML transformations
export const xmlPrettify = (text: string): string => {
  try {
    return xmlFormatter(text, {
      indentation: '  ',
      collapseContent: true
    })
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}

export const xmlCompact = (text: string): string => {
  try {
    // Remove whitespace between tags
    return text
      .replace(/>\s+</g, '><')
      .replace(/\s+</g, '<')
      .replace(/>\s+/g, '>')
      .trim()
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}

// Line operations
export const sortLines = (text: string): string => {
  return text
    .split('\n')
    .sort()
    .join('\n')
}

export const deduplicateLines = (text: string): string => {
  return [...new Set(text.split('\n'))].join('\n')
}

export const reverseLines = (text: string): string => {
  return text
    .split('\n')
    .reverse()
    .join('\n')
}

// HTML transformations
export const htmlEncode = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const htmlDecode = (text: string): string => {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}

// Hash generation
export const md5Hash = (text: string): string => {
  return CryptoJS.MD5(text).toString()
}

export const sha1Hash = (text: string): string => {
  return CryptoJS.SHA1(text).toString()
}

export const sha256Hash = (text: string): string => {
  return CryptoJS.SHA256(text).toString()
}

export const bcryptHash = (text: string, cost: number = 10): string => {
  try {
    return bcrypt.hashSync(text, cost)
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}

// Unicode escaping
export const unicodeEscape = (text: string): string => {
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char
    })
    .join('')
}

export const unicodeUnescape = (text: string): string => {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
}

// JSON to YAML conversion
export const jsonToYaml = (text: string): string => {
  try {
    const parsed = JSON.parse(text)
    return yaml.dump(parsed)
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}

export const yamlToJson = (text: string): string => {
  try {
    const parsed = yaml.load(text)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}

// Spring Boot properties conversion
export const propertiesFileToYaml = (text: string): string => {
  try {
    const result: Record<string, unknown> = {}

    text.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '') return

      const [key, value] = line.split('=').map(part => part.trim())
      if (!key || value === undefined) return

      // Handle nested properties (e.g., spring.datasource.url)
      const parts = key.split('.')
      let current = result

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (!current[part] || typeof current[part] !== 'object') {
          current[part] = {}
        }
        current = current[part] as Record<string, unknown>
      }

      current[parts[parts.length - 1]] = value
    })

    return yaml.dump(result)
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}

export const yamlToPropertiesFile = (text: string): string => {
  try {
    const parsed = yaml.load(text) as Record<string, unknown>
    const properties: string[] = []

    const flattenObject = (obj: Record<string, unknown>, prefix = ''): void => {
      Object.entries(obj).forEach(([key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key

        if (typeof value === 'object' && value !== null) {
          flattenObject(value as Record<string, unknown>, newKey)
        } else {
          properties.push(`${newKey}=${value}`)
        }
      })
    }

    flattenObject(parsed)
    return properties.join('\n')
  } catch (error) {
    return `Error: ${(error as Error).message}`
  }
}
