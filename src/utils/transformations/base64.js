import { logTransformation } from './utils';

/**
 * Encodes text to Base64
 * @param {string} text - The text to encode
 * @returns {string} Base64 encoded text
 */
export const base64Encode = (text) => {
    try {
        logTransformation('base64Encode', text);
        const result = btoa(text);
        logTransformation('base64Encode', text, result);
        return result;
    } catch (error) {
        throw new Error('Failed to encode text to Base64');
    }
};

/**
 * Decodes Base64 to text
 * @param {string} text - The Base64 string to decode
 * @returns {string} Decoded text
 */
export const base64Decode = (text) => {
    try {
        logTransformation('base64Decode', text);
        const result = atob(text);
        logTransformation('base64Decode', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid Base64 string');
    }
};
