const { expect } = require('chai');
const { md5Hash, sha1Hash, sha256Hash } = require('./mocks/hash');

describe('Hash Transformations', () => {
  describe('md5Hash', () => {
    it('should generate MD5 hash of text', () => {
      const input = 'Hello, World!';
      const expected = '65a8e27d8879283831b664bd8b7f0ad4';
      const result = md5Hash(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = 'd41d8cd98f00b204e9800998ecf8427e';
      const result = md5Hash(input);
      expect(result).to.equal(expected);
    });
  });

  describe('sha1Hash', () => {
    it('should generate SHA-1 hash of text', () => {
      const input = 'Hello, World!';
      const expected = '0a0a9f2a6772942557ab5355d76af442f8f65e01';
      const result = sha1Hash(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
      const result = sha1Hash(input);
      expect(result).to.equal(expected);
    });
  });

  describe('sha256Hash', () => {
    it('should generate SHA-256 hash of text', () => {
      const input = 'Hello, World!';
      const expected = 'dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f';
      const result = sha256Hash(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const result = sha256Hash(input);
      expect(result).to.equal(expected);
    });
  });
});
