const { expect } = require('chai');
const { base64Encode, base64Decode } = require('./mocks/base64');

describe('Base64 Transformations', () => {
  describe('base64Encode', () => {
    it('should encode a string to base64', () => {
      const input = 'Hello, World!';
      const expected = 'SGVsbG8sIFdvcmxkIQ==';
      const result = base64Encode(input);
      expect(result).to.equal(expected);
    });

    it('should encode an empty string to empty base64', () => {
      const input = '';
      const expected = '';
      const result = base64Encode(input);
      expect(result).to.equal(expected);
    });

    it('should throw an error for invalid input', () => {
      // Create an object that will cause btoa to fail
      const input = { toString: () => { throw new Error(); } };
      expect(() => base64Encode(input)).to.throw('Failed to encode text to Base64');
    });
  });

  describe('base64Decode', () => {
    it('should decode a base64 string', () => {
      const input = 'SGVsbG8sIFdvcmxkIQ==';
      const expected = 'Hello, World!';
      const result = base64Decode(input);
      expect(result).to.equal(expected);
    });

    it('should decode an empty base64 string to empty string', () => {
      const input = '';
      const expected = '';
      const result = base64Decode(input);
      expect(result).to.equal(expected);
    });

    it('should throw an error for invalid base64 input', () => {
      const input = 'Invalid Base64!@#';
      expect(() => base64Decode(input)).to.throw('Invalid Base64 string');
    });
  });
});
