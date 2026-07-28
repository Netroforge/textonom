import { describe, expect, it } from 'vitest'
import {
  jsonToPhp,
  jsonToPython,
  jsonToTypeScript,
  phpSerialize,
  phpUnserialize,
  unitConvert
} from '@renderer/transformations/conversion'

describe('unitConvert', () => {
  it('converts common linear units', async () => {
    expect(await unitConvert('1\n2.5', { fromUnit: 'km', toUnit: 'm' })).toBe('1000\n2500')
    expect(await unitConvert('', { fromUnit: 'km', toUnit: 'm' })).toBe('')
  })

  it('converts temperatures with offsets', async () => {
    expect(await unitConvert('32', { fromUnit: 'f', toUnit: 'c', precision: 2 })).toBe('0')
    expect(await unitConvert('100', { fromUnit: 'c', toUnit: 'f', precision: 2 })).toBe('212')
    expect(await unitConvert('212', { fromUnit: '°F', toUnit: '°C', precision: 2 })).toBe('100')
  })

  it('rejects incompatible dimensions', async () => {
    await expect(unitConvert('1', { fromUnit: 'kg', toUnit: 'm' })).rejects.toThrow(
      'Cannot convert'
    )
  })
})

describe('code generation', () => {
  const input = '{"name":"Textonom","active":true,"tags":["local","private"]}'

  it('generates PHP literals', async () => {
    expect(await jsonToPhp(input)).toContain("'name' => 'Textonom'")
  })

  it('generates Python literals', async () => {
    expect(await jsonToPython(input)).toContain('"active": True')
  })

  it('generates TypeScript interfaces', async () => {
    const result = await jsonToTypeScript(input, { rootName: 'Tool' })
    expect(result).toContain('export interface Tool')
    expect(result).toContain('tags: Array<string>;')
  })
})

describe('PHP serialization', () => {
  it('round-trips JSON-compatible data', async () => {
    const input = '{"name":"Textonom","values":[1,true,null]}'
    expect(JSON.parse(await phpUnserialize(await phpSerialize(input)))).toEqual(JSON.parse(input))
  })
})
