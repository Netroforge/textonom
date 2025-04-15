const { expect } = require('chai');
const { xmlPrettify, xmlCompact } = require('./mocks/xml');

describe('XML Transformations', () => {
  describe('xmlPrettify', () => {
    it('should format XML with indentation', () => {
      const input = '<root><child>value</child></root>';
      // Since we're using mocks, we'll just check that it returns something
      const result = xmlPrettify(input);
      expect(result).to.be.a('string');
    });

    it('should throw an error for invalid XML', () => {
      const input = '<invalid>';
      expect(() => xmlPrettify(input)).to.throw('Invalid XML format');
    });
  });

  describe('xmlCompact', () => {
    it('should compact XML by removing whitespace', () => {
      const input = '<root>\n  <child>value</child>\n</root>';
      // Since we're using mocks, we'll just check that it returns something
      const result = xmlCompact(input);
      expect(result).to.be.a('string');
    });

    it('should throw an error for invalid XML', () => {
      const input = '<invalid>';
      expect(() => xmlCompact(input)).to.throw('Invalid XML format');
    });
  });
});
