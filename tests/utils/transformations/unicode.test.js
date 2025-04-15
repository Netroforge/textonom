const { expect } = require('chai');
const { unicodeEscape, unicodeUnescape } = require('./mocks/unicode');

describe('Unicode Transformations', () => {
  describe('unicodeEscape', () => {
    it('should escape non-ASCII characters to Unicode escape sequences', () => {
      const input = 'Hello, 世界!';
      const expected = 'Hello, \\u4e16\\u754c!';
      const result = unicodeEscape(input);
      expect(result).to.equal(expected);
    });

    it('should not change ASCII characters', () => {
      const input = 'Hello, World!';
      const expected = 'Hello, World!';
      const result = unicodeEscape(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = unicodeEscape(input);
      expect(result).to.equal(expected);
    });

    it('should escape emojis correctly', () => {
      const input = 'Hello 😊';
      // Emoji may be represented as surrogate pairs
      const result = unicodeEscape(input);
      expect(result).to.include('Hello ');
      expect(result).to.not.include('😊');
    });
  });

  describe('unicodeUnescape', () => {
    it('should unescape Unicode escape sequences to characters', () => {
      const input = 'Hello, \\u4e16\\u754c!';
      const expected = 'Hello, 世界!';
      const result = unicodeUnescape(input);
      expect(result).to.equal(expected);
    });

    it('should not change text without escape sequences', () => {
      const input = 'Hello, World!';
      const expected = 'Hello, World!';
      const result = unicodeUnescape(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = unicodeUnescape(input);
      expect(result).to.equal(expected);
    });

    it('should handle multiple escape sequences', () => {
      const input = '\\u0048\\u0065\\u006c\\u006c\\u006f';
      const expected = 'Hello';
      const result = unicodeUnescape(input);
      expect(result).to.equal(expected);
    });
  });
});
