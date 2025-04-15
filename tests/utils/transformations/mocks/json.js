// Mock implementation of json.js for testing
export const jsonPrettify = (text) => {
  try {
    const obj = JSON.parse(text);
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

export const jsonCompact = (text) => {
  try {
    const obj = JSON.parse(text);
    return JSON.stringify(obj);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};
