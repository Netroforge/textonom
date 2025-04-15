const { expect } = require('chai');
const { jsonPrettify, jsonCompact } = require('./mocks/json');

describe('JSON Transformations', () => {
  describe('jsonPrettify', () => {
    it('should format JSON with indentation', () => {
      const input = '{"name":"John","age":30,"city":"New York"}';
      const expected = JSON.stringify(JSON.parse(input), null, 2);
      const result = jsonPrettify(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty objects', () => {
      const input = '{}';
      const expected = '{}';
      const result = jsonPrettify(input);
      expect(result).to.equal(expected);
    });

    it('should handle arrays', () => {
      const input = '[1,2,3,4]';
      const expected = JSON.stringify(JSON.parse(input), null, 2);
      const result = jsonPrettify(input);
      expect(result).to.equal(expected);
    });

    it('should throw an error for invalid JSON', () => {
      const input = '{invalid json}';
      expect(() => jsonPrettify(input)).to.throw('Invalid JSON format');
    });
  });

  describe('jsonCompact', () => {
    it('should compact JSON by removing whitespace', () => {
      const input = '{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}';
      const expected = '{"name":"John","age":30,"city":"New York"}';
      const result = jsonCompact(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty objects', () => {
      const input = '{ }';
      const expected = '{}';
      const result = jsonCompact(input);
      expect(result).to.equal(expected);
    });

    it('should handle arrays', () => {
      const input = '[\n  1,\n  2,\n  3,\n  4\n]';
      const expected = '[1,2,3,4]';
      const result = jsonCompact(input);
      expect(result).to.equal(expected);
    });

    it('should throw an error for invalid JSON', () => {
      const input = '{invalid json}';
      expect(() => jsonCompact(input)).to.throw('Invalid JSON format');
    });
  });
});
