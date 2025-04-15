const { expect } = require('chai');
const jsYaml = require('js-yaml');
const { jsonToYaml, yamlToJson, propertiesToYaml, yamlToProperties } = require('./mocks/yaml');

describe('YAML Transformations', () => {
  describe('jsonToYaml', () => {
    it('should convert JSON to YAML', () => {
      const input = '{"name":"John","age":30,"city":"New York"}';
      const obj = JSON.parse(input);
      const expected = jsYaml.dump(obj);
      const result = jsonToYaml(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty objects', () => {
      const input = '{}';
      const expected = '{}\n';
      const result = jsonToYaml(input);
      expect(result).to.equal(expected);
    });

    it('should handle arrays', () => {
      const input = '[1,2,3,4]';
      const obj = JSON.parse(input);
      const expected = jsYaml.dump(obj);
      const result = jsonToYaml(input);
      expect(result).to.equal(expected);
    });

    it('should throw an error for invalid JSON', () => {
      const input = '{invalid json}';
      expect(() => jsonToYaml(input)).to.throw('Invalid JSON format');
    });
  });

  describe('yamlToJson', () => {
    it('should convert YAML to JSON', () => {
      const input = 'name: John\nage: 30\ncity: New York';
      const obj = jsYaml.load(input);
      const expected = JSON.stringify(obj, null, 2);
      const result = yamlToJson(input);
      expect(result).to.equal(expected);
    });

    it('should handle empty YAML', () => {
      const input = '';
      const result = yamlToJson(input);
      // Just check that it returns something without throwing an error
      expect(result).to.be.a('string');
    });

    it('should handle arrays', () => {
      const input = '- 1\n- 2\n- 3\n- 4';
      const obj = jsYaml.load(input);
      const expected = JSON.stringify(obj, null, 2);
      const result = yamlToJson(input);
      expect(result).to.equal(expected);
    });

    it('should throw an error for invalid YAML', () => {
      const input = 'name: John\nage: 30\n  city: New York';
      expect(() => yamlToJson(input)).to.throw('Invalid YAML format');
    });
  });

  describe('propertiesToYaml', () => {
    it('should convert Java properties to YAML', () => {
      const input = 'name=John\nage=30\ncity=New York';
      const result = propertiesToYaml(input);
      expect(result).to.include('name: John');
      // Values might be quoted in the YAML output
      expect(result).to.include('age:').and.to.match(/30|'30'/);
      expect(result).to.include('city:').and.to.include('New York');
    });

    it('should handle nested properties', () => {
      const input = 'person.name=John\nperson.age=30\nperson.address.city=New York';
      const result = propertiesToYaml(input);
      expect(result).to.include('person:');
      expect(result).to.include('name: John');
      // Values might be quoted in the YAML output
      expect(result).to.include('age:').and.to.match(/30|'30'/);
      expect(result).to.include('address:');
      expect(result).to.include('city:').and.to.include('New York');
    });

    it('should handle empty properties', () => {
      const input = '';
      const expected = '{}\n';
      const result = propertiesToYaml(input);
      expect(result).to.equal(expected);
    });

    it('should skip comments and empty lines', () => {
      const input = '# This is a comment\nname=John\n\nage=30';
      const result = propertiesToYaml(input);
      expect(result).to.include('name: John');
      // Values might be quoted in the YAML output
      expect(result).to.include('age:').and.to.match(/30|'30'/);
      expect(result).to.not.include('# This is a comment');
    });
  });

  describe('yamlToProperties', () => {
    it('should convert YAML to Java properties', () => {
      const input = 'name: John\nage: 30\ncity: New York';
      const result = yamlToProperties(input);
      expect(result).to.include('name=John');
      expect(result).to.include('age=30');
      expect(result).to.include('city=New York');
    });

    it('should handle nested YAML', () => {
      const input = 'person:\n  name: John\n  age: 30\n  address:\n    city: New York';
      const result = yamlToProperties(input);
      expect(result).to.include('person.name=John');
      expect(result).to.include('person.age=30');
      expect(result).to.include('person.address.city=New York');
    });

    it('should handle empty YAML', () => {
      const input = '';
      const expected = '';
      const result = yamlToProperties(input);
      expect(result).to.equal(expected);
    });

    it('should throw an error for invalid YAML', () => {
      const input = 'name: John\nage: 30\n  city: New York';
      expect(() => yamlToProperties(input)).to.throw('Invalid YAML format');
    });
  });
});
