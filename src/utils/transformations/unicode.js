import { logTransformation } from './utils';

/**
 * Escapes non-ASCII characters to Unicode escape sequences
 * @param {string} text - The text to escape
 * @returns {string} Unicode escaped text
 */
export const unicodeEscape = (text) => {
    logTransformation('unicodeEscape', text);
    const result = text.replace(/[^\u0000-\u007F]/g, (char) => {
        return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
    });
    logTransformation('unicodeEscape', text, result);
    return result;
};

/**
 * Unescapes Unicode escape sequences to characters
 * @param {string} text - The Unicode escaped text to unescape
 * @returns {string} Unescaped text
 */
export const unicodeUnescape = (text) => {
    logTransformation('unicodeUnescape', text);
    const result = text.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });
    logTransformation('unicodeUnescape', text, result);
    return result;
};
