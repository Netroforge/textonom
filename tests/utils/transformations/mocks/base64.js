// Mock implementation of base64.js for testing
export const base64Encode = (text) => {
  try {
    return Buffer.from(text).toString('base64');
  } catch (error) {
    throw new Error('Failed to encode text to Base64');
  }
};

export const base64Decode = (text) => {
  try {
    // Check for invalid base64 characters
    if (text.match(/[^A-Za-z0-9+/=]/)) {
      throw new Error('Invalid Base64 string');
    }
    return Buffer.from(text, 'base64').toString();
  } catch (error) {
    throw new Error('Invalid Base64 string');
  }
};
