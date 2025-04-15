// Mock implementation of lines.js for testing
import { detectLineEnding } from './utils';

export const sortLines = (text) => {
  // Detect line ending type
  const lineEnding = detectLineEnding(text);
  
  // Split by detected line ending, sort, and join back
  const lines = text.split(lineEnding);
  const sortedLines = lines.sort();
  
  return sortedLines.join(lineEnding);
};

export const deduplicateLines = (text) => {
  // Detect line ending type
  const lineEnding = detectLineEnding(text);
  
  // Split by detected line ending, deduplicate, and join back
  const lines = text.split(lineEnding);
  const uniqueLines = [...new Set(lines)];
  
  return uniqueLines.join(lineEnding);
};

export const reverseLines = (text) => {
  // Detect line ending type
  const lineEnding = detectLineEnding(text);
  
  // Split by detected line ending, reverse, and join back
  const lines = text.split(lineEnding);
  const reversedLines = lines.reverse();
  
  return reversedLines.join(lineEnding);
};
