// Mock implementation of url.js for testing
export const urlEncode = (text) => {
  try {
    return encodeURIComponent(text);
  } catch (error) {
    throw new Error('Failed to URL encode text');
  }
};

export const urlDecode = (text) => {
  try {
    return decodeURIComponent(text);
  } catch (error) {
    throw new Error('Invalid URL encoded string');
  }
};
