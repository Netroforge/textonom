import { logTransformation } from './utils';

/**
 * Encodes text for use in URLs
 * @param {string} text - The text to encode
 * @returns {string} URL encoded text
 */
export const urlEncode = (text) => {
    try {
        logTransformation('urlEncode', text);
        const result = encodeURIComponent(text);
        logTransformation('urlEncode', text, result);
        return result;
    } catch (error) {
        throw new Error('Failed to URL encode text');
    }
};

/**
 * Decodes URL encoded text
 * @param {string} text - The URL encoded text to decode
 * @returns {string} Decoded text
 */
export const urlDecode = (text) => {
    try {
        logTransformation('urlDecode', text);
        const result = decodeURIComponent(text);
        logTransformation('urlDecode', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid URL encoded string');
    }
};
