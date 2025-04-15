// Mock implementation of utils.js for testing
export const logTransformation = (transformName, text, result) => {
  // Do nothing in tests
};

export const detectLineEnding = (text) => {
  if (text.includes('\r\n')) {
    return '\r\n';
  } else if (text.includes('\r') && !text.includes('\n')) {
    return '\r';
  }
  return '\n';
};
