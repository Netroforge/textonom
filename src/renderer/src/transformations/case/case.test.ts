import { describe, it, expect } from 'vitest'
import toUpperCase from '@renderer/transformations/case/upper'
import toLowerCase from '@renderer/transformations/case/lower'
import toCamelCase from '@renderer/transformations/case/camel-case'
import toSnakeCase from '@renderer/transformations/case/snake-case'
import toKebabCase from '@renderer/transformations/case/kebab-case'
import toTitleCase from '@renderer/transformations/case/title'

describe('toUpperCase', () => {
  it('uppercases text', async () => {
    expect(await toUpperCase('Hello World')).toBe('HELLO WORLD')
  })
})

describe('toLowerCase', () => {
  it('lowercases text', async () => {
    expect(await toLowerCase('Hello World')).toBe('hello world')
  })
})

describe('toCamelCase', () => {
  it('returns empty string for empty input', async () => {
    expect(await toCamelCase('')).toBe('')
  })

  it('converts space-separated words', async () => {
    expect(await toCamelCase('hello world')).toBe('helloWorld')
  })

  it('converts underscores and spaces', async () => {
    expect(await toCamelCase('foo_bar baz')).toBe('fooBarBaz')
  })

  it('lowercases a leading capital', async () => {
    expect(await toCamelCase('Foo Bar')).toBe('fooBar')
  })
})

describe('toSnakeCase', () => {
  it('returns empty string for empty input', async () => {
    expect(await toSnakeCase('')).toBe('')
  })

  it('converts camelCase', async () => {
    expect(await toSnakeCase('helloWorld')).toBe('hello_world')
  })

  it('converts spaces and hyphens', async () => {
    expect(await toSnakeCase('foo bar-baz')).toBe('foo_bar_baz')
  })
})

describe('toKebabCase', () => {
  it('returns empty string for empty input', async () => {
    expect(await toKebabCase('')).toBe('')
  })

  it('converts camelCase', async () => {
    expect(await toKebabCase('helloWorld')).toBe('hello-world')
  })

  it('converts spaces and underscores', async () => {
    expect(await toKebabCase('foo bar_baz')).toBe('foo-bar-baz')
  })
})

describe('toTitleCase', () => {
  it('capitalizes the first letter of each word', async () => {
    expect(await toTitleCase('hello world')).toBe('Hello World')
  })

  it('lowercases the rest of each word', async () => {
    expect(await toTitleCase('hELLO wORLD')).toBe('Hello World')
  })
})
