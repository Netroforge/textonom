/**
 * Utility functions for text transformations
 */

/**
 * Detects the line ending type in the given text
 * @param {string} text - The text to analyze
 * @returns {string} The detected line ending (\n, \r, or \r\n)
 */
export const detectLineEnding = (text) => {
    if (text.includes('\r\n')) {
        return '\r\n';
    } else if (text.includes('\r') && !text.includes('\n')) {
        return '\r';
    }
    return '\n';
};

/**
 * Logs information about the transformation process
 * @param {string} transformName - The name of the transformation
 * @param {string} text - The input text
 * @param {string} result - The transformed text
 */
export const logTransformation = (transformName, text, result) => {
    console.log(`${transformName} called with text length: ${text.length}`);
    if (result) {
        console.log(`${transformName} result length: ${result.length}`);
    }
};
