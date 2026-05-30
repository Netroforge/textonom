import { describe, it, expect } from 'vitest'
import jsonToYaml from '@renderer/transformations/conversion/json-to-yaml'
import yamlToJson from '@renderer/transformations/conversion/yaml-to-json'
import propertiesFileToYaml from '@renderer/transformations/conversion/properties-to-yaml'
import yamlToPropertiesFile from '@renderer/transformations/conversion/yaml-to-properties'
import csvToJson from '@renderer/transformations/conversion/csv-to-json'
import jsonToCsv from '@renderer/transformations/conversion/json-to-csv'
import jsonToToml from '@renderer/transformations/conversion/json-to-toml'
import tomlToJson from '@renderer/transformations/conversion/toml-to-json'
import yamlToToml from '@renderer/transformations/conversion/yaml-to-toml'
import tomlToYaml from '@renderer/transformations/conversion/toml-to-yaml'
import jsonToXml from '@renderer/transformations/conversion/json-to-xml'
import xmlToJson from '@renderer/transformations/conversion/xml-to-json'
import htmlToMarkdown from '@renderer/transformations/conversion/html-to-markdown'
import queryStringToJson from '@renderer/transformations/conversion/query-to-json'
import jsonToQueryString from '@renderer/transformations/conversion/json-to-query'
import romanToNumber from '@renderer/transformations/conversion/roman-to-number'
import numberToRoman from '@renderer/transformations/conversion/number-to-roman'
import cronToHuman from '@renderer/transformations/conversion/cron-to-human'

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

describe('jsonToToml', () => {
  it('returns empty string for empty input', async () => {
    expect(await jsonToToml('')).toBe('')
  })

  it('converts JSON to TOML', async () => {
    const result = await jsonToToml('{"title":"app","owner":{"name":"Alice"}}')
    expect(result).toContain('title = "app"')
    expect(result).toContain('[owner]')
    expect(result).toContain('name = "Alice"')
  })

  it('throws on invalid JSON', async () => {
    await expect(jsonToToml('{bad}')).rejects.toThrow('Invalid JSON format')
  })
})

describe('tomlToJson', () => {
  it('converts TOML to JSON', async () => {
    const result = await tomlToJson('title = "app"\n[owner]\nname = "Alice"')
    expect(JSON.parse(result)).toEqual({ title: 'app', owner: { name: 'Alice' } })
  })

  it('throws on invalid TOML', async () => {
    await expect(tomlToJson('= nope')).rejects.toThrow('Failed to convert TOML to JSON')
  })

  it('round-trips with jsonToToml', async () => {
    const json = '{\n  "a": 1,\n  "b": {\n    "c": "x"\n  }\n}'
    expect(await tomlToJson(await jsonToToml(json))).toBe(json)
  })
})

describe('yamlToToml', () => {
  it('converts YAML to TOML', async () => {
    expect(await yamlToToml('name: Alice\nage: 30')).toContain('name = "Alice"')
  })
})

describe('tomlToYaml', () => {
  it('converts TOML to YAML', async () => {
    expect(await tomlToYaml('name = "Alice"\nage = 30')).toBe('name: Alice\nage: 30\n')
  })
})

describe('jsonToXml', () => {
  it('returns empty string for empty input', async () => {
    expect(await jsonToXml('')).toBe('')
  })

  it('converts JSON to indented XML', async () => {
    expect(await jsonToXml('{"root":{"child":"v"}}')).toBe('<root>\n  <child>v</child>\n</root>')
  })

  it('throws on invalid JSON', async () => {
    await expect(jsonToXml('{bad}')).rejects.toThrow('Invalid JSON format')
  })
})

describe('xmlToJson', () => {
  it('converts XML to JSON', async () => {
    const result = await xmlToJson('<root><child>v</child></root>')
    expect(JSON.parse(result)).toEqual({ root: { child: 'v' } })
  })

  it('throws on malformed XML', async () => {
    await expect(xmlToJson('<root><child></root>')).rejects.toThrow('Failed to convert XML to JSON')
  })
})

describe('htmlToMarkdown', () => {
  it('returns empty string for empty input', async () => {
    expect(await htmlToMarkdown('')).toBe('')
  })

  it('converts headings to ATX style', async () => {
    expect(await htmlToMarkdown('<h1>Hi</h1>')).toBe('# Hi')
  })

  it('converts inline emphasis', async () => {
    expect(await htmlToMarkdown('<p>a <strong>b</strong></p>')).toBe('a **b**')
  })
})

describe('queryStringToJson', () => {
  it('returns empty string for empty input', async () => {
    expect(await queryStringToJson('')).toBe('')
  })

  it('parses key/value pairs', async () => {
    expect(JSON.parse(await queryStringToJson('a=1&b=2'))).toEqual({ a: '1', b: '2' })
  })

  it('strips a leading "?" or full URL', async () => {
    expect(JSON.parse(await queryStringToJson('https://x.com/p?a=1&b=2'))).toEqual({
      a: '1',
      b: '2'
    })
  })

  it('collects repeated keys into an array', async () => {
    expect(JSON.parse(await queryStringToJson('a=1&a=2'))).toEqual({ a: ['1', '2'] })
  })
})

describe('jsonToQueryString', () => {
  it('returns empty string for empty input', async () => {
    expect(await jsonToQueryString('')).toBe('')
  })

  it('builds a query string, encoding values', async () => {
    expect(await jsonToQueryString('{"a":1,"b":"x y"}')).toBe('a=1&b=x+y')
  })

  it('emits array values as repeated keys', async () => {
    expect(await jsonToQueryString('{"a":[1,2]}')).toBe('a=1&a=2')
  })

  it('throws when the input is not an object', async () => {
    await expect(jsonToQueryString('[1,2]')).rejects.toThrow('must be an object')
  })
})

describe('numberToRoman', () => {
  it('returns empty string for empty input', async () => {
    expect(await numberToRoman('')).toBe('')
  })

  it('converts integers to Roman numerals', async () => {
    expect(await numberToRoman('14')).toBe('XIV')
    expect(await numberToRoman('1994')).toBe('MCMXCIV')
  })

  it('processes each line', async () => {
    expect(await numberToRoman('1\n4\n9')).toBe('I\nIV\nIX')
  })

  it('throws on out-of-range values', async () => {
    await expect(numberToRoman('4000')).rejects.toThrow('between 1 and 3999')
  })
})

describe('romanToNumber', () => {
  it('converts Roman numerals to integers', async () => {
    expect(await romanToNumber('XIV')).toBe('14')
    expect(await romanToNumber('MCMXCIV')).toBe('1994')
  })

  it('throws on an invalid numeral', async () => {
    await expect(romanToNumber('IIII')).rejects.toThrow('not a valid Roman numeral')
  })

  it('round-trips with numberToRoman', async () => {
    expect(await romanToNumber(await numberToRoman('2024'))).toBe('2024')
  })
})

describe('cronToHuman', () => {
  it('returns empty string for empty input', async () => {
    expect(await cronToHuman('')).toBe('')
  })

  it('describes a cron expression', async () => {
    expect(await cronToHuman('0 9 * * 1-5')).toContain('09:00')
  })

  it('throws on an invalid expression', async () => {
    await expect(cronToHuman('not a cron')).rejects.toThrow('Invalid cron expression')
  })
})
