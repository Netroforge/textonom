// Mock implementation of unicode.js for testing
export const unicodeEscape = (text) => {
  return text.replace(/[^\u0000-\u007F]/g, (char) => {
    return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
  });
};

export const unicodeUnescape = (text) => {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
};
