import { describe, it, expect } from 'vitest'
import jsonToYaml from '@renderer/transformations/conversion/json-to-yaml'
import yamlToJson from '@renderer/transformations/conversion/yaml-to-json'
import propertiesFileToYaml from '@renderer/transformations/conversion/properties-to-yaml'
import yamlToPropertiesFile from '@renderer/transformations/conversion/yaml-to-properties'
import csvToJson from '@renderer/transformations/conversion/csv-to-json'
import jsonToCsv from '@renderer/transformations/conversion/json-to-csv'

describe('jsonToYaml', () => {
  it('converts JSON to YAML', async () => {
    expect(await jsonToYaml('{"name":"Alice","age":30}')).toBe('name: Alice\nage: 30\n')
  })

  it('throws on invalid JSON', async () => {
    await expect(jsonToYaml('{bad}')).rejects.toThrow('Invalid JSON format')
  })
})

describe('yamlToJson', () => {
  it('converts YAML to indented JSON', async () => {
    expect(await yamlToJson('name: Alice\nage: 30')).toBe('{\n  "name": "Alice",\n  "age": 30\n}')
  })

  it('throws on invalid YAML', async () => {
    await expect(yamlToJson('a:\n- b\n  c: d')).rejects.toThrow('Invalid YAML format')
  })
})

describe('propertiesFileToYaml', () => {
  it('returns empty string for empty input', async () => {
    expect(await propertiesFileToYaml('')).toBe('')
  })

  it('expands dotted keys into nested YAML', async () => {
    const result = await propertiesFileToYaml('server.host=localhost\nserver.port=8080\n# comment')
    const parsed = (await yamlToJson(result)) as string
    expect(JSON.parse(parsed)).toEqual({ server: { host: 'localhost', port: '8080' } })
  })
})

describe('yamlToPropertiesFile', () => {
  it('flattens nested YAML into dotted keys', async () => {
    const result = await yamlToPropertiesFile('server:\n  host: localhost\n  port: 8080')
    expect(result.split('\n').sort()).toEqual(['server.host=localhost', 'server.port=8080'])
  })
})

describe('csvToJson', () => {
  it('returns empty string for empty input', async () => {
    expect(await csvToJson('')).toBe('')
  })

  it('uses the header row as keys by default', async () => {
    const result = await csvToJson('name,age\nAlice,30\nBob,25')
    expect(JSON.parse(result)).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' }
    ])
  })

  it('handles quoted values containing the delimiter', async () => {
    const result = await csvToJson('name,note\n"Smith, John","a ""quoted"" word"')
    expect(JSON.parse(result)).toEqual([{ name: 'Smith, John', note: 'a "quoted" word' }])
  })

  it('uses positional keys when hasHeader is false', async () => {
    const result = await csvToJson('a,b', { hasHeader: false })
    expect(JSON.parse(result)).toEqual([{ column1: 'a', column2: 'b' }])
  })
})

describe('jsonToCsv', () => {
  it('returns empty string for empty input', async () => {
    expect(await jsonToCsv('')).toBe('')
  })

  it('converts an array of objects to CSV with a header', async () => {
    const result = await jsonToCsv('[{"name":"Alice","age":30},{"name":"Bob","age":25}]')
    expect(result).toBe('name,age\nAlice,30\nBob,25')
  })

  it('quotes values containing the delimiter', async () => {
    const result = await jsonToCsv('[{"name":"Smith, John"}]')
    expect(result).toBe('name\n"Smith, John"')
  })

  it('throws when the input is not an array', async () => {
    await expect(jsonToCsv('{"a":1}')).rejects.toThrow('must be an array of objects')
  })
})
