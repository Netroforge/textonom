import { logTransformation } from './utils';

/**
 * Converts text to uppercase
 * @param {string} text - The text to convert
 * @returns {string} Uppercase text
 */
export const toUpperCase = (text) => {
    logTransformation('toUpperCase', text);
    const result = text.toUpperCase();
    logTransformation('toUpperCase', text, result);
    return result;
};

/**
 * Converts text to lowercase
 * @param {string} text - The text to convert
 * @returns {string} Lowercase text
 */
export const toLowerCase = (text) => {
    logTransformation('toLowerCase', text);
    const result = text.toLowerCase();
    logTransformation('toLowerCase', text, result);
    return result;
};

/**
 * Converts text to title case (first letter of each word capitalized)
 * @param {string} text - The text to convert
 * @returns {string} Title case text
 */
export const toTitleCase = (text) => {
    logTransformation('toTitleCase', text);
    const result = text.replace(
        /\w\S*/g,
        (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    );
    logTransformation('toTitleCase', text, result);
    return result;
};
