import CryptoJS from 'crypto-js';
import jsYaml from 'js-yaml';

// Base64 transformations
export const base64Encode = (text) => {
    try {
        return btoa(text);
    } catch (error) {
        throw new Error('Failed to encode text to Base64');
    }
};

export const base64Decode = (text) => {
    try {
        return atob(text);
    } catch (error) {
        throw new Error('Invalid Base64 string');
    }
};

// JSON transformations
export const jsonPrettify = (text) => {
    try {
        const obj = JSON.parse(text);
        return JSON.stringify(obj, null, 2);
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
};

export const jsonCompact = (text) => {
    try {
        const obj = JSON.parse(text);
        return JSON.stringify(obj);
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
};

// URL transformations
export const urlEncode = (text) => {
    try {
        return encodeURIComponent(text);
    } catch (error) {
        throw new Error('Failed to URL encode text');
    }
};

export const urlDecode = (text) => {
    try {
        return decodeURIComponent(text);
    } catch (error) {
        throw new Error('Invalid URL encoded string');
    }
};

// Case transformations
export const toUpperCase = (text) => {
    return text.toUpperCase();
};

export const toLowerCase = (text) => {
    return text.toLowerCase();
};

export const toTitleCase = (text) => {
    return text.replace(
        /\w\S*/g,
        (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    );
};

// XML transformations
export const xmlPrettify = (text) => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML format');
        }

        // Format XML
        const serializer = new XMLSerializer();
        let formatted = '';
        let indent = '';

        const format = (node, level) => {
            if (node.nodeType === 3) { // Text node
                const value = node.nodeValue.trim();
                if (value) {
                    formatted += indent + value + '\\n';
                }
            } else if (node.nodeType === 1) { // Element node
                const hasChildren = node.childNodes.length > 0;
                const hasTextOnly = hasChildren && node.childNodes.length === 1 && node.childNodes[0].nodeType === 3;

                if (hasTextOnly) {
                    formatted += indent + serializer.serializeToString(node) + '\\n';
                } else {
                    formatted += indent + '<' + node.nodeName;

                    // Add attributes
                    for (let i = 0; i < node.attributes.length; i++) {
                        const attr = node.attributes[i];
                        formatted += ' ' + attr.name + '="' + attr.value + '"';
                    }

                    if (hasChildren) {
                        formatted += '>\\n';

                        // Process child nodes with increased indentation
                        const oldIndent = indent;
                        indent += '  ';

                        for (let i = 0; i < node.childNodes.length; i++) {
                            format(node.childNodes[i], level + 1);
                        }

                        indent = oldIndent;
                        formatted += indent + '</' + node.nodeName + '>\\n';
                    } else {
                        formatted += '/>\\n';
                    }
                }
            }
        };

        // Process all root elements
        for (let i = 0; i < xmlDoc.childNodes.length; i++) {
            format(xmlDoc.childNodes[i], 0);
        }

        return formatted.replace(/\\n/g, '\\n');
    } catch (error) {
        throw new Error('Invalid XML format: ' + error.message);
    }
};

export const xmlCompact = (text) => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML format');
        }

        // Compact XML
        const serializer = new XMLSerializer();
        return serializer.serializeToString(xmlDoc);
    } catch (error) {
        throw new Error('Invalid XML format: ' + error.message);
    }
};

// Line operations
export const sortLines = (text) => {
    return text.split('\\n').sort().join('\\n');
};

export const deduplicateLines = (text) => {
    return [...new Set(text.split('\\n'))].join('\\n');
};

export const reverseLines = (text) => {
    return text.split('\\n').reverse().join('\\n');
};

// HTML transformations
export const htmlEncode = (text) => {
    const el = document.createElement('div');
    el.innerText = text;
    return el.innerHTML;
};

export const htmlDecode = (text) => {
    const el = document.createElement('div');
    el.innerHTML = text;
    return el.innerText;
};

// Hash generation
export const md5Hash = (text) => {
    return CryptoJS.MD5(text).toString();
};

export const sha1Hash = (text) => {
    return CryptoJS.SHA1(text).toString();
};

export const sha256Hash = (text) => {
    return CryptoJS.SHA256(text).toString();
};

// Unicode transformations
export const unicodeEscape = (text) => {
    return text.replace(/[^\\u0000-\\u007F]/g, (char) => {
        return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
    });
};

export const unicodeUnescape = (text) => {
    return text.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });
};

// JSON/YAML conversions
export const jsonToYaml = (text) => {
    try {
        const obj = JSON.parse(text);
        return jsYaml.dump(obj);
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
};

export const yamlToJson = (text) => {
    try {
        const obj = jsYaml.load(text);
        return JSON.stringify(obj, null, 2);
    } catch (error) {
        throw new Error('Invalid YAML format');
    }
};

// Spring Boot properties conversions
export const propertiesToYaml = (text) => {
    try {
        const properties = {};

        // Parse properties file
        text.split('\\n').forEach(line => {
            // Skip comments and empty lines
            if (line.trim() === '' || line.trim().startsWith('#')) {
                return;
            }

            // Split by first equals sign
            const separatorIndex = line.indexOf('=');
            if (separatorIndex > 0) {
                const key = line.substring(0, separatorIndex).trim();
                const value = line.substring(separatorIndex + 1).trim();

                // Handle nested properties
                const keyParts = key.split('.');
                let current = properties;

                for (let i = 0; i < keyParts.length - 1; i++) {
                    const part = keyParts[i];
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                }

                // Set the value
                current[keyParts[keyParts.length - 1]] = value;
            }
        });

        return jsYaml.dump(properties);
    } catch (error) {
        throw new Error('Invalid properties format');
    }
};

export const yamlToProperties = (text) => {
    try {
        const obj = jsYaml.load(text);
        const properties = [];

        // Flatten nested objects into dot notation
        const flatten = (obj, prefix = '') => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    flatten(obj[key], prefix + key + '.');
                } else {
                    properties.push(prefix + key + '=' + obj[key]);
                }
            }
        };

        flatten(obj);
        return properties.join('\\n');
    } catch (error) {
        throw new Error('Invalid YAML format');
    }
};

// Apply transformation based on type
export const applyTransformation = (text, type) => {
    switch (type) {
        case 'base64-encode':
            return base64Encode(text);
        case 'base64-decode':
            return base64Decode(text);
        case 'json-prettify':
            return jsonPrettify(text);
        case 'json-compact':
            return jsonCompact(text);
        case 'url-encode':
            return urlEncode(text);
        case 'url-decode':
            return urlDecode(text);
        case 'case-upper':
            return toUpperCase(text);
        case 'case-lower':
            return toLowerCase(text);
        case 'case-title':
            return toTitleCase(text);
        case 'xml-prettify':
            return xmlPrettify(text);
        case 'xml-compact':
            return xmlCompact(text);
        case 'lines-sort':
            return sortLines(text);
        case 'lines-deduplicate':
            return deduplicateLines(text);
        case 'lines-reverse':
            return reverseLines(text);
        case 'html-encode':
            return htmlEncode(text);
        case 'html-decode':
            return htmlDecode(text);
        case 'hash-md5':
            return md5Hash(text);
        case 'hash-sha1':
            return sha1Hash(text);
        case 'hash-sha256':
            return sha256Hash(text);
        case 'unicode-escape':
            return unicodeEscape(text);
        case 'unicode-unescape':
            return unicodeUnescape(text);
        case 'json-to-yaml':
            return jsonToYaml(text);
        case 'yaml-to-json':
            return yamlToJson(text);
        case 'properties-to-yaml':
            return propertiesToYaml(text);
        case 'yaml-to-properties':
            return yamlToProperties(text);
        default:
            return text;
    }
};
