const { expect } = require('chai');
const { toUpperCase, toLowerCase, toTitleCase } = require('./mocks/case');

describe('Case Transformations', () => {
  describe('toUpperCase', () => {
    it('should convert text to uppercase', () => {
      const input = 'Hello World';
      const expected = 'HELLO WORLD';
      const result = toUpperCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle already uppercase text', () => {
      const input = 'ALREADY UPPERCASE';
      const expected = 'ALREADY UPPERCASE';
      const result = toUpperCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = toUpperCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle special characters and numbers', () => {
      const input = 'Special Ch@r$ & 123';
      const expected = 'SPECIAL CH@R$ & 123';
      const result = toUpperCase(input);
      expect(result).to.equal(expected);
    });
  });

  describe('toLowerCase', () => {
    it('should convert text to lowercase', () => {
      const input = 'Hello World';
      const expected = 'hello world';
      const result = toLowerCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle already lowercase text', () => {
      const input = 'already lowercase';
      const expected = 'already lowercase';
      const result = toLowerCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = toLowerCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle special characters and numbers', () => {
      const input = 'SPECIAL CH@R$ & 123';
      const expected = 'special ch@r$ & 123';
      const result = toLowerCase(input);
      expect(result).to.equal(expected);
    });
  });

  describe('toTitleCase', () => {
    it('should convert text to title case', () => {
      const input = 'hello world';
      const expected = 'Hello World';
      const result = toTitleCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle mixed case text', () => {
      const input = 'hElLo WoRlD';
      const expected = 'Hello World';
      const result = toTitleCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = toTitleCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle special characters and numbers', () => {
      const input = 'special ch@r$ & 123';
      const expected = 'Special Ch@r$ & 123';
      const result = toTitleCase(input);
      expect(result).to.equal(expected);
    });

    it('should handle multiple words with spaces', () => {
      const input = 'the quick brown fox jumps over the lazy dog';
      const expected = 'The Quick Brown Fox Jumps Over The Lazy Dog';
      const result = toTitleCase(input);
      expect(result).to.equal(expected);
    });
  });
});
