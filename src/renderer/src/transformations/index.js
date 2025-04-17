import { Base64 } from 'js-base64'
import yaml from 'js-yaml'
import CryptoJS from 'crypto-js'
import bcrypt from 'bcryptjs'

// Base64 transformations
export const base64Encode = (text) => {
  try {
    return Base64.encode(text)
  } catch (error) {
    console.error('Error encoding to Base64:', error)
    throw new Error('Failed to encode text to Base64')
  }
}

export const base64Decode = (text) => {
  try {
    return Base64.decode(text)
  } catch (error) {
    console.error('Error decoding from Base64:', error)
    throw new Error('Failed to decode Base64 text')
  }
}

// JSON transformations
export const jsonPrettify = (text) => {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    console.error('Error prettifying JSON:', error)
    throw new Error('Failed to prettify JSON: Invalid JSON format')
  }
}

export const jsonCompact = (text) => {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed)
  } catch (error) {
    console.error('Error compacting JSON:', error)
    throw new Error('Failed to compact JSON: Invalid JSON format')
  }
}

// URL transformations
export const urlEncode = (text) => {
  try {
    return encodeURIComponent(text)
  } catch (error) {
    console.error('Error URL encoding:', error)
    throw new Error('Failed to URL encode text')
  }
}

export const urlDecode = (text) => {
  try {
    return decodeURIComponent(text)
  } catch (error) {
    console.error('Error URL decoding:', error)
    throw new Error('Failed to URL decode text')
  }
}

// Case transformations
export const toUpperCase = (text) => text.toUpperCase()
export const toLowerCase = (text) => text.toLowerCase()
export const toTitleCase = (text) => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// XML transformations
export const xmlPrettify = (text) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'text/xml')

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error('Invalid XML format')
    }

    const serializer = new XMLSerializer()
    let formatted = ''
    let indent = ''

    // Custom formatting function
    const format = (node, level) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim()
        if (text) {
          formatted += indent + text + '\\n'
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const hasChildren = node.hasChildNodes()
        const hasTextOnly = hasChildren && node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE

        if (!hasTextOnly) {
          formatted += indent + '<' + node.nodeName

          // Add attributes
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i]
            formatted += ' ' + attr.name + '="' + attr.value + '"'
          }

          if (hasChildren) {
            formatted += '>\\n'

            // Increase indent for children
            indent += '  '

            // Process child nodes
            for (let i = 0; i < node.childNodes.length; i++) {
              format(node.childNodes[i], level + 1)
            }

            // Decrease indent
            indent = indent.slice(0, -2)

            formatted += indent + '</' + node.nodeName + '>\\n'
          } else {
            formatted += '/>\\n'
          }
        } else {
          // Handle elements with text content only
          formatted += indent + '<' + node.nodeName

          // Add attributes
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i]
            formatted += ' ' + attr.name + '="' + attr.value + '"'
          }

          formatted += '>' + node.textContent.trim() + '</' + node.nodeName + '>\\n'
        }
      }
    }

    // Start formatting from the root element
    format(xmlDoc.documentElement, 0)

    return formatted
  } catch (error) {
    console.error('Error prettifying XML:', error)
    throw new Error('Failed to prettify XML: ' + error.message)
  }
}

export const xmlCompact = (text) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'text/xml')

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error('Invalid XML format')
    }

    const serializer = new XMLSerializer()
    return serializer.serializeToString(xmlDoc)
  } catch (error) {
    console.error('Error compacting XML:', error)
    throw new Error('Failed to compact XML: ' + error.message)
  }
}

// Line operations
export const sortLines = (text) => {
  if (!text) return text
  // Handle different types of newlines (CR, LF, CRLF)
  const lines = text.split(/\r\n|\r|\n/)
  return lines.sort().join('\n')
}

export const deduplicateLines = (text) => {
  if (!text) return text
  // Handle different types of newlines (CR, LF, CRLF)
  const lines = text.split(/\r\n|\r|\n/)
  return [...new Set(lines)].join('\n')
}

export const reverseLines = (text) => {
  if (!text) return text
  // Handle different types of newlines (CR, LF, CRLF)
  const lines = text.split(/\r\n|\r|\n/)
  return lines.reverse().join('\n')
}

// HTML transformations
export const htmlEncode = (text) => {
  const el = document.createElement('div')
  el.innerText = text
  return el.innerHTML
}

export const htmlDecode = (text) => {
  const el = document.createElement('div')
  el.innerHTML = text
  return el.innerText
}

// Hash generation
export const md5Hash = (text) => {
  return CryptoJS.MD5(text).toString()
}

export const sha1Hash = (text) => {
  return CryptoJS.SHA1(text).toString()
}

export const sha256Hash = (text) => {
  return CryptoJS.SHA256(text).toString()
}

export const bcryptHash = (text, costFactor = 10) => {
  return bcrypt.hashSync(text, costFactor)
}

// Unicode escaping
export const unicodeEscape = (text) => {
  return text.replace(/[\u007F-\uFFFF]/g, (char) => {
    return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4)
  })
}

export const unicodeUnescape = (text) => {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16))
  })
}

// JSON to YAML conversion
export const jsonToYaml = (text) => {
  try {
    const parsed = JSON.parse(text)
    return yaml.dump(parsed)
  } catch (error) {
    console.error('Error converting JSON to YAML:', error)
    throw new Error('Failed to convert JSON to YAML: Invalid JSON format')
  }
}

export const yamlToJson = (text) => {
  try {
    const parsed = yaml.load(text)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    console.error('Error converting YAML to JSON:', error)
    throw new Error('Failed to convert YAML to JSON: Invalid YAML format')
  }
}

// Spring Boot properties conversion
export const propertiesFileToYaml = (text) => {
  try {
    if (!text) return ''
    // Handle different types of newlines (CR, LF, CRLF)
    const lines = text.split(/\r\n|\r|\n/)
    const result = {}

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
    throw new Error('Failed to convert properties to YAML: ' + error.message)
  }
}

export const yamlToPropertiesFile = (text) => {
  try {
    const parsed = yaml.load(text)
    const lines = []

    // Recursive function to flatten nested objects
    const flattenObject = (obj, prefix = '') => {
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
    throw new Error('Failed to convert YAML to properties: ' + error.message)
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
