// Mock implementation of xml.js for testing
export const xmlPrettify = (text) => {
  try {
    if (text.includes('<invalid>')) {
      throw new Error('Invalid XML format');
    }
    // Simple mock implementation
    return '<root>\n  <child>value</child>\n</root>';
  } catch (error) {
    throw new Error('Invalid XML format: ' + error.message);
  }
};

export const xmlCompact = (text) => {
  try {
    if (text.includes('<invalid>')) {
      throw new Error('Invalid XML format');
    }
    // Simple mock implementation
    return '<root><child>value</child></root>';
  } catch (error) {
    throw new Error('Invalid XML format: ' + error.message);
  }
};
