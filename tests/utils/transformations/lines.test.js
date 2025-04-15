const { expect } = require('chai');
const { sortLines, deduplicateLines, reverseLines } = require('./mocks/lines');

describe('Lines Transformations', () => {
  describe('sortLines', () => {
    it('should sort lines alphabetically', () => {
      const input = 'c\nb\na';
      const expected = 'a\nb\nc';
      const result = sortLines(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = sortLines(input);
      expect(result).to.equal(expected);
    });

    it('should handle single line', () => {
      const input = 'single line';
      const expected = 'single line';
      const result = sortLines(input);
      expect(result).to.equal(expected);
    });

    it('should preserve line endings', () => {
      const input = 'c\r\nb\r\na';
      const expected = 'a\r\nb\r\nc';
      const result = sortLines(input);
      expect(result).to.equal(expected);
    });
  });

  describe('deduplicateLines', () => {
    it('should remove duplicate lines', () => {
      const input = 'a\nb\na\nc\nb';
      const expected = 'a\nb\nc';
      const result = deduplicateLines(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = deduplicateLines(input);
      expect(result).to.equal(expected);
    });

    it('should handle single line', () => {
      const input = 'single line';
      const expected = 'single line';
      const result = deduplicateLines(input);
      expect(result).to.equal(expected);
    });

    it('should preserve line endings', () => {
      const input = 'a\r\nb\r\na\r\nc\r\nb';
      const expected = 'a\r\nb\r\nc';
      const result = deduplicateLines(input);
      expect(result).to.equal(expected);
    });
  });

  describe('reverseLines', () => {
    it('should reverse the order of lines', () => {
      const input = 'a\nb\nc';
      const expected = 'c\nb\na';
      const result = reverseLines(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = reverseLines(input);
      expect(result).to.equal(expected);
    });

    it('should handle single line', () => {
      const input = 'single line';
      const expected = 'single line';
      const result = reverseLines(input);
      expect(result).to.equal(expected);
    });

    it('should preserve line endings', () => {
      const input = 'a\r\nb\r\nc';
      const expected = 'c\r\nb\r\na';
      const result = reverseLines(input);
      expect(result).to.equal(expected);
    });
  });
});
