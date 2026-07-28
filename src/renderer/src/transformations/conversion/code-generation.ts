import type { TransformationFunction, TransformationParamValues } from '../../types/transformation'

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Input must be valid JSON')
  }
}

const phpLiteral = (value: unknown, depth = 0): string => {
  const indent = '  '.repeat(depth)
  const childIndent = '  '.repeat(depth + 1)
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[\n${value.map((item) => `${childIndent}${phpLiteral(item, depth + 1)}`).join(',\n')}\n${indent}]`
  }
  const entries = Object.entries(value as Record<string, unknown>)
  if (entries.length === 0) return '[]'
  return `[\n${entries
    .map(
      ([key, item]) =>
        `${childIndent}${phpLiteral(key, depth + 1)} => ${phpLiteral(item, depth + 1)}`
    )
    .join(',\n')}\n${indent}]`
}

const jsonToPhp: TransformationFunction = async (text: string): Promise<string> =>
  `<?php\n\n$data = ${phpLiteral(parseJson(text))};\n`

const pythonLiteral = (value: unknown, depth = 0): string => {
  const indent = '    '.repeat(depth)
  const childIndent = '    '.repeat(depth + 1)
  if (value === null) return 'None'
  if (typeof value === 'boolean') return value ? 'True' : 'False'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[\n${value.map((item) => `${childIndent}${pythonLiteral(item, depth + 1)},`).join('\n')}\n${indent}]`
  }
  const entries = Object.entries(value as Record<string, unknown>)
  if (entries.length === 0) return '{}'
  return `{\n${entries
    .map(
      ([key, item]) => `${childIndent}${JSON.stringify(key)}: ${pythonLiteral(item, depth + 1)},`
    )
    .join('\n')}\n${indent}}`
}

const jsonToPython: TransformationFunction = async (text: string): Promise<string> =>
  `data = ${pythonLiteral(parseJson(text))}\n`

const safeTypeName = (value: unknown): string =>
  String(value ?? 'Root')
    .replace(/[^A-Za-z0-9_$]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') || 'Root'

const propertyName = (name: string): string =>
  /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name)

const inferType = (
  value: unknown,
  suggestedName: string,
  interfaces: Map<string, string>
): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const types = [
      ...new Set(
        value.map((item) => inferType(item, `${safeTypeName(suggestedName)}Item`, interfaces))
      )
    ]
    return `Array<${types.join(' | ')}>`
  }
  if (typeof value !== 'object') return typeof value

  const interfaceName = safeTypeName(suggestedName)
  if (!interfaces.has(interfaceName)) {
    interfaces.set(interfaceName, '')
    const properties = Object.entries(value as Record<string, unknown>).map(
      ([key, item]) =>
        `  ${propertyName(key)}: ${inferType(item, `${interfaceName}${safeTypeName(key)}`, interfaces)};`
    )
    interfaces.set(
      interfaceName,
      `export interface ${interfaceName} {\n${properties.join('\n')}\n}`
    )
  }
  return interfaceName
}

const jsonToTypeScript: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  const value = parseJson(text)
  const rootName = safeTypeName(params?.rootName ?? 'Root')
  const interfaces = new Map<string, string>()
  const rootType = inferType(value, rootName, interfaces)
  const declarations = [...interfaces.values()].filter(Boolean).reverse()

  if (declarations.length === 0) {
    declarations.push(`export type ${rootName} = ${rootType}`)
  }
  return declarations.join('\n\n')
}

export { jsonToPhp, jsonToPython, jsonToTypeScript }
