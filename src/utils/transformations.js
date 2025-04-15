// Re-export all transformations
import {base64Decode, base64Encode} from "./transformations/base64";
import {jsonToYaml, propertiesToYaml, yamlToJson, yamlToProperties} from "./transformations/yaml";
import {unicodeEscape, unicodeUnescape} from "./transformations/unicode";
import {jsonCompact, jsonPrettify} from "./transformations/json";
import {urlDecode, urlEncode} from "./transformations/url";
import {toLowerCase, toTitleCase, toUpperCase} from "./transformations/case";
import {xmlCompact, xmlPrettify} from "./transformations/xml";
import {deduplicateLines, reverseLines, sortLines} from "./transformations/lines";
import {htmlDecode, htmlEncode} from "./transformations/html";
import {md5Hash, sha1Hash, sha256Hash} from "./transformations/hash";

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
