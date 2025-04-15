import { logTransformation } from './utils';

/**
 * Encodes text for use in HTML
 * @param {string} text - The text to encode
 * @returns {string} HTML encoded text
 */
export const htmlEncode = (text) => {
    logTransformation('htmlEncode', text);
    const el = document.createElement('div');
    el.innerText = text;
    const result = el.innerHTML;
    logTransformation('htmlEncode', text, result);
    return result;
};

/**
 * Decodes HTML encoded text
 * @param {string} text - The HTML encoded text to decode
 * @returns {string} Decoded text
 */
export const htmlDecode = (text) => {
    logTransformation('htmlDecode', text);
    const el = document.createElement('div');
    el.innerHTML = text;
    const result = el.innerText;
    logTransformation('htmlDecode', text, result);
    return result;
};
