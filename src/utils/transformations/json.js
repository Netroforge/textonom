import { logTransformation } from './utils';

/**
 * Formats JSON with indentation
 * @param {string} text - The JSON string to format
 * @returns {string} Formatted JSON
 */
export const jsonPrettify = (text) => {
    try {
        logTransformation('jsonPrettify', text);
        const obj = JSON.parse(text);
        const result = JSON.stringify(obj, null, 2);
        logTransformation('jsonPrettify', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
};

/**
 * Compacts JSON by removing whitespace
 * @param {string} text - The JSON string to compact
 * @returns {string} Compacted JSON
 */
export const jsonCompact = (text) => {
    try {
        logTransformation('jsonCompact', text);
        const obj = JSON.parse(text);
        const result = JSON.stringify(obj);
        logTransformation('jsonCompact', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
};
