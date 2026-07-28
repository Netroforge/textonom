import type { TransformationFunction, TransformationParamValues } from '../../types/transformation'

interface UnitDefinition {
  dimension: string
  factor: number
  offset?: number
}

const units: Record<string, UnitDefinition> = {
  mm: { dimension: 'length', factor: 0.001 },
  cm: { dimension: 'length', factor: 0.01 },
  m: { dimension: 'length', factor: 1 },
  km: { dimension: 'length', factor: 1000 },
  in: { dimension: 'length', factor: 0.0254 },
  ft: { dimension: 'length', factor: 0.3048 },
  yd: { dimension: 'length', factor: 0.9144 },
  mi: { dimension: 'length', factor: 1609.344 },
  'mm²': { dimension: 'area', factor: 0.000001 },
  'cm²': { dimension: 'area', factor: 0.0001 },
  'm²': { dimension: 'area', factor: 1 },
  'km²': { dimension: 'area', factor: 1_000_000 },
  'in²': { dimension: 'area', factor: 0.00064516 },
  'ft²': { dimension: 'area', factor: 0.09290304 },
  acre: { dimension: 'area', factor: 4046.8564224 },
  hectare: { dimension: 'area', factor: 10_000 },
  mg: { dimension: 'mass', factor: 0.000001 },
  g: { dimension: 'mass', factor: 0.001 },
  kg: { dimension: 'mass', factor: 1 },
  oz: { dimension: 'mass', factor: 0.028349523125 },
  lb: { dimension: 'mass', factor: 0.45359237 },
  tonne: { dimension: 'mass', factor: 1000 },
  'm/s': { dimension: 'speed', factor: 1 },
  'km/h': { dimension: 'speed', factor: 1 / 3.6 },
  mph: { dimension: 'speed', factor: 0.44704 },
  knot: { dimension: 'speed', factor: 0.5144444444444445 },
  bit: { dimension: 'data', factor: 0.125 },
  byte: { dimension: 'data', factor: 1 },
  kb: { dimension: 'data', factor: 1000 },
  mb: { dimension: 'data', factor: 1_000_000 },
  gb: { dimension: 'data', factor: 1_000_000_000 },
  tb: { dimension: 'data', factor: 1_000_000_000_000 },
  kib: { dimension: 'data', factor: 1024 },
  mib: { dimension: 'data', factor: 1024 ** 2 },
  gib: { dimension: 'data', factor: 1024 ** 3 },
  tib: { dimension: 'data', factor: 1024 ** 4 },
  ml: { dimension: 'volume', factor: 0.001 },
  l: { dimension: 'volume', factor: 1 },
  'm³': { dimension: 'volume', factor: 1000 },
  tsp: { dimension: 'volume', factor: 0.00492892159375 },
  tbsp: { dimension: 'volume', factor: 0.01478676478125 },
  cup: { dimension: 'volume', factor: 0.2365882365 },
  'fl oz': { dimension: 'volume', factor: 0.0295735295625 },
  gal: { dimension: 'volume', factor: 3.785411784 },
  ms: { dimension: 'time', factor: 0.001 },
  s: { dimension: 'time', factor: 1 },
  min: { dimension: 'time', factor: 60 },
  h: { dimension: 'time', factor: 3600 },
  day: { dimension: 'time', factor: 86400 },
  week: { dimension: 'time', factor: 604800 },
  c: { dimension: 'temperature', factor: 1, offset: 0 },
  f: { dimension: 'temperature', factor: 5 / 9, offset: -32 },
  k: { dimension: 'temperature', factor: 1, offset: -273.15 }
}

const aliases: Record<string, string> = {
  meter: 'm',
  meters: 'm',
  metre: 'm',
  metres: 'm',
  kilometer: 'km',
  kilometers: 'km',
  mile: 'mi',
  miles: 'mi',
  foot: 'ft',
  feet: 'ft',
  inch: 'in',
  inches: 'in',
  pound: 'lb',
  pounds: 'lb',
  celsius: 'c',
  '°c': 'c',
  fahrenheit: 'f',
  '°f': 'f',
  kelvin: 'k',
  b: 'byte'
}

const normalizeUnit = (input: unknown): string => {
  const value = String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/\^2$/, '²')
    .replace(/\^3$/, '³')
  return aliases[value] ?? value
}

const convertTemperature = (value: number, from: UnitDefinition, to: UnitDefinition): number => {
  const celsius = (value + (from.offset ?? 0)) * from.factor
  return celsius / to.factor - (to.offset ?? 0)
}

const unitConvert: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text.trim() === '') return ''

  const fromName = normalizeUnit(params?.fromUnit)
  const toName = normalizeUnit(params?.toUnit)
  const from = units[fromName]
  const to = units[toName]
  const precision = Math.max(0, Math.min(15, Number(params?.precision ?? 6)))

  if (!from || !to) {
    throw new Error(`Unknown unit. Supported units: ${Object.keys(units).sort().join(', ')}`)
  }
  if (from.dimension !== to.dimension) {
    throw new Error(`Cannot convert ${from.dimension} units to ${to.dimension} units`)
  }

  return text
    .split(/\r?\n/)
    .map((line) => {
      const value = Number(line.trim())
      if (!Number.isFinite(value)) throw new Error(`Invalid number: ${line}`)
      const converted =
        from.dimension === 'temperature'
          ? convertTemperature(value, from, to)
          : (value * from.factor) / to.factor
      return Number(converted.toFixed(precision)).toString()
    })
    .join('\n')
}

export default unitConvert
