const { expect } = require('chai');
const { htmlEncode, htmlDecode } = require('./mocks/html');

describe('HTML Transformations', () => {
  describe('htmlEncode', () => {
    it('should encode text for use in HTML', () => {
      const input = '<div>Hello & World</div>';
      const expected = '&lt;div&gt;Hello &amp; World&lt;/div&gt;';
      const result = htmlEncode(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = htmlEncode(input);
      expect(result).to.equal(expected);
    });

    it('should encode special characters', () => {
      const input = '< > & " \'';
      const expected = '&lt; &gt; &amp; &quot; &#039;';
      const result = htmlEncode(input);
      expect(result).to.equal(expected);
    });
  });

  describe('htmlDecode', () => {
    it('should decode HTML encoded text', () => {
      const input = '&lt;div&gt;Hello &amp; World&lt;/div&gt;';
      const expected = '<div>Hello & World</div>';
      const result = htmlDecode(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      const result = htmlDecode(input);
      expect(result).to.equal(expected);
    });

    it('should decode special characters', () => {
      const input = '&lt; &gt; &amp; &quot; &#039;';
      const expected = '< > & " \'';
      const result = htmlDecode(input);
      expect(result).to.equal(expected);
    });
  });
});
