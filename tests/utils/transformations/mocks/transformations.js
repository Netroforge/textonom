// Mock implementation of transformations.js for testing
import * as base64 from './base64';
import * as json from './json';
import * as url from './url';
import * as caseTransforms from './case';
import * as xml from './xml';
import * as lines from './lines';
import * as html from './html';
import * as hash from './hash';
import * as unicode from './unicode';
import * as yaml from './yaml';

// Re-export all transformations
export const base64Encode = base64.base64Encode;
export const base64Decode = base64.base64Decode;
export const jsonPrettify = json.jsonPrettify;
export const jsonCompact = json.jsonCompact;
export const urlEncode = url.urlEncode;
export const urlDecode = url.urlDecode;
export const toUpperCase = caseTransforms.toUpperCase;
export const toLowerCase = caseTransforms.toLowerCase;
export const toTitleCase = caseTransforms.toTitleCase;
export const xmlPrettify = xml.xmlPrettify;
export const xmlCompact = xml.xmlCompact;
export const sortLines = lines.sortLines;
export const deduplicateLines = lines.deduplicateLines;
export const reverseLines = lines.reverseLines;
export const htmlEncode = html.htmlEncode;
export const htmlDecode = html.htmlDecode;
export const md5Hash = hash.md5Hash;
export const sha1Hash = hash.sha1Hash;
export const sha256Hash = hash.sha256Hash;
export const unicodeEscape = unicode.unicodeEscape;
export const unicodeUnescape = unicode.unicodeUnescape;
export const jsonToYaml = yaml.jsonToYaml;
export const yamlToJson = yaml.yamlToJson;
export const propertiesToYaml = yaml.propertiesToYaml;
export const yamlToProperties = yaml.yamlToProperties;

/**
 * Apply transformation based on type
 * @param {string} text - The text to transform
 * @param {string} type - The transformation type
 * @returns {string} Transformed text
 */
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
