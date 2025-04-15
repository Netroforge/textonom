const { expect } = require('chai');
const { applyTransformation } = require('./transformations/mocks/transformations');

describe('Transformations', () => {
  describe('applyTransformation', () => {
    it('should apply base64-encode transformation', () => {
      const input = 'Hello, World!';
      const type = 'base64-encode';
      const result = applyTransformation(input, type);
      expect(result).to.equal('SGVsbG8sIFdvcmxkIQ==');
    });

    it('should apply base64-decode transformation', () => {
      const input = 'SGVsbG8sIFdvcmxkIQ==';
      const type = 'base64-decode';
      const result = applyTransformation(input, type);
      expect(result).to.equal('Hello, World!');
    });

    it('should apply json-prettify transformation', () => {
      const input = '{"name":"John","age":30}';
      const type = 'json-prettify';
      const result = applyTransformation(input, type);
      expect(result).to.equal(JSON.stringify(JSON.parse(input), null, 2));
    });

    it('should apply json-compact transformation', () => {
      const input = '{\n  "name": "John",\n  "age": 30\n}';
      const type = 'json-compact';
      const result = applyTransformation(input, type);
      expect(result).to.equal('{"name":"John","age":30}');
    });

    it('should apply url-encode transformation', () => {
      const input = 'Hello World & Special Characters: ?=&';
      const type = 'url-encode';
      const result = applyTransformation(input, type);
      expect(result).to.equal('Hello%20World%20%26%20Special%20Characters%3A%20%3F%3D%26');
    });

    it('should apply url-decode transformation', () => {
      const input = 'Hello%20World%20%26%20Special%20Characters%3A%20%3F%3D%26';
      const type = 'url-decode';
      const result = applyTransformation(input, type);
      expect(result).to.equal('Hello World & Special Characters: ?=&');
    });

    it('should apply case-upper transformation', () => {
      const input = 'Hello, World!';
      const type = 'case-upper';
      const result = applyTransformation(input, type);
      expect(result).to.equal('HELLO, WORLD!');
    });

    it('should apply case-lower transformation', () => {
      const input = 'Hello, World!';
      const type = 'case-lower';
      const result = applyTransformation(input, type);
      expect(result).to.equal('hello, world!');
    });

    it('should apply case-title transformation', () => {
      const input = 'hello world';
      const type = 'case-title';
      const result = applyTransformation(input, type);
      expect(result).to.equal('Hello World');
    });

    it('should return original text for unknown transformation type', () => {
      const input = 'Hello, World!';
      const type = 'unknown-transformation';
      const result = applyTransformation(input, type);
      expect(result).to.equal(input);
    });
  });
});
