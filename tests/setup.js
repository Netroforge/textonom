// Mock browser globals for testing
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');

// Mock DOMParser and XMLSerializer for XML tests
class MockDOMParser {
  parseFromString(text, mimeType) {
    // Simple mock for testing - not a full implementation
    const doc = {
      childNodes: [{ nodeType: 1, nodeName: 'root', attributes: [], childNodes: [] }],
      querySelector: (selector) => {
        if (selector === 'parsererror') {
          return text.includes('<invalid>') ? {} : null;
        }
        return null;
      }
    };
    return doc;
  }
}

class MockXMLSerializer {
  serializeToString(node) {
    // Simple mock for testing
    return '<root></root>';
  }
}

global.DOMParser = MockDOMParser;
global.XMLSerializer = MockXMLSerializer;

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
console.log = (...args) => {
  // Uncomment to see logs during tests
  // originalConsoleLog(...args);
};
