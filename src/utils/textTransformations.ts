import yaml from 'js-yaml';

// Base64 encoding/decoding
export const base64Encode = (text: string): string => {
  try {
    return btoa(text);
  } catch (error) {
    console.error('Error encoding to base64:', error);
    throw new Error('Failed to encode text to base64');
  }
};

export const base64Decode = (text: string): string => {
  try {
    return atob(text);
  } catch (error) {
    console.error('Error decoding from base64:', error);
    throw new Error('Failed to decode base64 text');
  }
};

// JSON formatting
export const jsonPrettify = (text: string): string => {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    console.error('Error prettifying JSON:', error);
    throw new Error('Failed to prettify JSON: Invalid JSON format');
  }
};

export const jsonCompact = (text: string): string => {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed);
  } catch (error) {
    console.error('Error compacting JSON:', error);
    throw new Error('Failed to compact JSON: Invalid JSON format');
  }
};

// URL encoding/decoding
export const urlEncode = (text: string): string => {
  try {
    return encodeURIComponent(text);
  } catch (error) {
    console.error('Error URL encoding:', error);
    throw new Error('Failed to URL encode text');
  }
};

export const urlDecode = (text: string): string => {
  try {
    return decodeURIComponent(text);
  } catch (error) {
    console.error('Error URL decoding:', error);
    throw new Error('Failed to URL decode text');
  }
};

// Case transformations
export const toUpperCase = (text: string): string => {
  return text.toUpperCase();
};

export const toLowerCase = (text: string): string => {
  return text.toLowerCase();
};

export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// XML formatting
export const xmlPrettify = (text: string): string => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format');
    }

    let formatted = '';
    let indent = '';

    const serializeNode = (node: Node, level: number) => {
      indent = '  '.repeat(level);

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim() || '';
        if (text) {
          formatted += text;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        formatted += `\n${indent}<${element.tagName}`;

        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          formatted += ` ${attr.name}="${attr.value}"`;
        }

        if (element.childNodes.length === 0) {
          formatted += '/>';
        } else {
          formatted += '>';

          let hasNonTextChild = false;
          for (let i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].nodeType !== Node.TEXT_NODE) {
              hasNonTextChild = true;
              break;
            }
          }

          for (let i = 0; i < element.childNodes.length; i++) {
            serializeNode(element.childNodes[i], level + 1);
          }

          if (hasNonTextChild) {
            formatted += `\n${indent}`;
          }

          formatted += `</${element.tagName}>`;
        }
      }
    };

    serializeNode(xmlDoc.documentElement, 0);
    return formatted;
  } catch (error) {
    console.error('Error prettifying XML:', error);
    throw new Error('Failed to prettify XML: Invalid XML format');
  }
};

export const xmlCompact = (text: string): string => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format');
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  } catch (error) {
    console.error('Error compacting XML:', error);
    throw new Error('Failed to compact XML: Invalid XML format');
  }
};

// Line operations
export const sortLines = (text: string): string => {
  return text.split('\n').sort().join('\n');
};

export const deduplicateLines = (text: string): string => {
  return [...new Set(text.split('\n'))].join('\n');
};

export const reverseLines = (text: string): string => {
  return text.split('\n').reverse().join('\n');
};

// HTML encoding/decoding
export const htmlEncode = (text: string): string => {
  const el = document.createElement('div');
  el.textContent = text;
  return el.innerHTML;
};

export const htmlDecode = (text: string): string => {
  const el = document.createElement('div');
  el.innerHTML = text;
  return el.textContent || '';
};

// Hash generation
export const md5Hash = async (text: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error generating MD5 hash:', error);
    throw new Error('Failed to generate MD5 hash');
  }
};

export const sha1Hash = async (text: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error generating SHA-1 hash:', error);
    throw new Error('Failed to generate SHA-1 hash');
  }
};

export const sha256Hash = async (text: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error generating SHA-256 hash:', error);
    throw new Error('Failed to generate SHA-256 hash');
  }
};

// Unicode escaping
export const unicodeEscape = (text: string): string => {
  return text.replace(/[\u007F-\uFFFF]/g, (char) => {
    return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
  });
};

export const unicodeUnescape = (text: string): string => {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
};

// JSON to YAML conversion
export const jsonToYaml = (text: string): string => {
  try {
    const jsonObj = JSON.parse(text);
    return yaml.dump(jsonObj, { indent: 2 });
  } catch (error) {
    console.error('Error converting JSON to YAML:', error);
    throw new Error('Failed to convert JSON to YAML: Invalid JSON format');
  }
};

export const yamlToJson = (text: string): string => {
  try {
    const yamlObj = yaml.load(text);
    return JSON.stringify(yamlObj, null, 2);
  } catch (error) {
    console.error('Error converting YAML to JSON:', error);
    throw new Error('Failed to convert YAML to JSON: Invalid YAML format');
  }
};

// Spring Boot properties conversion
export const propertiesFileToYaml = (text: string): string => {
  try {
    const properties: Record<string, any> = {};

    text.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '') {
        return;
      }

      const separatorIndex = line.indexOf('=');
      if (separatorIndex > 0) {
        const key = line.substring(0, separatorIndex).trim();
        const value = line.substring(separatorIndex + 1).trim();

        // Handle nested properties (e.g., spring.datasource.url)
        const keyParts = key.split('.');
        let current = properties;

        for (let i = 0; i < keyParts.length - 1; i++) {
          const part = keyParts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }

        // Set the value for the last key part
        current[keyParts[keyParts.length - 1]] = value;
      }
    });

    return yaml.dump(properties, { indent: 2 });
  } catch (error) {
    console.error('Error converting properties to YAML:', error);
    throw new Error('Failed to convert properties to YAML');
  }
};

export const yamlToPropertiesFile = (text: string): string => {
  try {
    const yamlObj = yaml.load(text) as Record<string, any>;
    const properties: string[] = [];

    const flattenObject = (obj: Record<string, any>, prefix = '') => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          flattenObject(obj[key], prefix + key + '.');
        } else {
          properties.push(`${prefix}${key}=${obj[key]}`);
        }
      }
    };

    flattenObject(yamlObj);
    return properties.join('\n');
  } catch (error) {
    console.error('Error converting YAML to properties:', error);
    throw new Error('Failed to convert YAML to properties');
  }
};
