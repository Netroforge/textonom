import CryptoJS from 'crypto-js';
import { logTransformation } from './utils';

/**
 * Generates MD5 hash of text
 * @param {string} text - The text to hash
 * @returns {string} MD5 hash
 */
export const md5Hash = (text) => {
    logTransformation('md5Hash', text);
    const result = CryptoJS.MD5(text).toString();
    logTransformation('md5Hash', text, result);
    return result;
};

/**
 * Generates SHA-1 hash of text
 * @param {string} text - The text to hash
 * @returns {string} SHA-1 hash
 */
export const sha1Hash = (text) => {
    logTransformation('sha1Hash', text);
    const result = CryptoJS.SHA1(text).toString();
    logTransformation('sha1Hash', text, result);
    return result;
};

/**
 * Generates SHA-256 hash of text
 * @param {string} text - The text to hash
 * @returns {string} SHA-256 hash
 */
export const sha256Hash = (text) => {
    logTransformation('sha256Hash', text);
    const result = CryptoJS.SHA256(text).toString();
    logTransformation('sha256Hash', text, result);
    return result;
};
