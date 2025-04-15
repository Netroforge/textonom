import { logTransformation, detectLineEnding } from './utils';

/**
 * Sorts lines alphabetically
 * @param {string} text - The text with lines to sort
 * @returns {string} Text with sorted lines
 */
export const sortLines = (text) => {
    logTransformation('sortLines', text);
    
    // Detect line ending type
    const lineEnding = detectLineEnding(text);
    
    // Split by detected line ending, sort, and join back
    const lines = text.split(lineEnding);
    console.log('Split into', lines.length, 'lines');
    
    const sortedLines = lines.sort();
    console.log('Lines sorted');
    
    const result = sortedLines.join(lineEnding);
    logTransformation('sortLines', text, result);
    
    return result;
};

/**
 * Removes duplicate lines
 * @param {string} text - The text with lines to deduplicate
 * @returns {string} Text with unique lines
 */
export const deduplicateLines = (text) => {
    logTransformation('deduplicateLines', text);
    
    // Detect line ending type
    const lineEnding = detectLineEnding(text);
    
    // Split by detected line ending, deduplicate, and join back
    const lines = text.split(lineEnding);
    const uniqueLines = [...new Set(lines)];
    
    const result = uniqueLines.join(lineEnding);
    logTransformation('deduplicateLines', text, result);
    
    return result;
};

/**
 * Reverses the order of lines
 * @param {string} text - The text with lines to reverse
 * @returns {string} Text with reversed line order
 */
export const reverseLines = (text) => {
    logTransformation('reverseLines', text);
    
    // Detect line ending type
    const lineEnding = detectLineEnding(text);
    
    // Split by detected line ending, reverse, and join back
    const lines = text.split(lineEnding);
    const reversedLines = lines.reverse();
    
    const result = reversedLines.join(lineEnding);
    logTransformation('reverseLines', text, result);
    
    return result;
};
