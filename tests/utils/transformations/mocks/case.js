// Mock implementation of case.js for testing
export const toUpperCase = (text) => {
  return text.toUpperCase();
};

export const toLowerCase = (text) => {
  return text.toLowerCase();
};

export const toTitleCase = (text) => {
  return text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
  );
};
