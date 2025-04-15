const { expect } = require('chai');
const { urlEncode, urlDecode } = require('./mocks/url');

describe('URL Transformations', () => {
  describe('urlEncode', () => {
    it('should encode text for use in URLs', () => {
      const input = 'Hello World & Special Characters: ?=&';
      const expected = 'Hello%20World%20%26%20Special%20Characters%3A%20%3F%3D%26';
      const result = urlEncode(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = urlEncode(input);
      expect(result).to.equal(expected);
    });

    it('should throw an error for invalid input', () => {
      // Create an object that will cause encodeURIComponent to fail
      const input = { toString: () => { throw new Error(); } };
      expect(() => urlEncode(input)).to.throw('Failed to URL encode text');
    });
  });

  describe('urlDecode', () => {
    it('should decode URL encoded text', () => {
      const input = 'Hello%20World%20%26%20Special%20Characters%3A%20%3F%3D%26';
      const expected = 'Hello World & Special Characters: ?=&';
      const result = urlDecode(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = urlDecode(input);
      expect(result).to.equal(expected);
    });

    it('should throw an error for invalid URL encoded input', () => {
      const input = '%invalid%';
      expect(() => urlDecode(input)).to.throw('Invalid URL encoded string');
    });
  });
});
