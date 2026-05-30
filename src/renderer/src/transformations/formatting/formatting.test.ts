import { describe, it, expect } from 'vitest'
import sqlFormat from '@renderer/transformations/formatting/sql-format'
import htmlFormat from '@renderer/transformations/formatting/html-format'
import cssFormat from '@renderer/transformations/formatting/css-format'
import jsFormat from '@renderer/transformations/formatting/js-format'
import xmlFormat from '@renderer/transformations/formatting/xml-format'
import codeFormat from '@renderer/transformations/formatting/code-format'

describe('sqlFormat', () => {
  it('returns empty string for empty input', async () => {
    expect(await sqlFormat('')).toBe('')
  })

  it('reflows a query onto multiple lines, preserving keyword case by default', async () => {
    const result = await sqlFormat('select id, name from users where id = 1')
    expect(result.split('\n').length).toBeGreaterThan(1)
    expect(result).toContain('from')
  })

  it('uppercases keywords when requested', async () => {
    const result = await sqlFormat('select 1', { uppercase: true })
    expect(result).toContain('SELECT')
  })
})

describe('cssFormat', () => {
  it('returns empty string for empty input', async () => {
    expect(await cssFormat('')).toBe('')
  })

  it('formats a rule with indentation', async () => {
    expect(await cssFormat('a{color:red}')).toBe('a {\n  color: red;\n}\n')
  })
})

describe('jsFormat', () => {
  it('returns empty string for empty input', async () => {
    expect(await jsFormat('')).toBe('')
  })

  it('adds spacing and a trailing semicolon', async () => {
    expect(await jsFormat('const x=1')).toBe('const x = 1;\n')
  })
})

describe('htmlFormat', () => {
  it('returns empty string for empty input', async () => {
    expect(await htmlFormat('')).toBe('')
  })

  it('indents nested elements', async () => {
    const result = await htmlFormat('<div><p>hi</p></div>')
    expect(result).toContain('<div>')
    expect(result).toContain('<p>hi</p>')
    expect(result.split('\n').length).toBeGreaterThan(1)
  })
})

describe('xmlFormat', () => {
  it('returns empty string for empty input', async () => {
    expect(await xmlFormat('')).toBe('')
  })

  it('indents nested elements with the requested indent size', async () => {
    const result = await xmlFormat('<root><child>v</child></root>', { indentSize: 2 })
    expect(result).toBe('<root>\n  <child>\n    v\n  </child>\n</root>')
  })
})

describe('codeFormat', () => {
  it('returns empty string for empty input', async () => {
    expect(await codeFormat('')).toBe('')
  })

  it('delegates to the CSS formatter', async () => {
    expect(await codeFormat('a{color:red}', { language: 'css' })).toBe('a {\n  color: red;\n}\n')
  })

  it('throws on an unsupported language', async () => {
    await expect(codeFormat('x', { language: 'cobol' })).rejects.toThrow('Unsupported language')
  })
})
