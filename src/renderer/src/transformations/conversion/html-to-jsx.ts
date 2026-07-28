import type { TransformationFunction } from '../../types/transformation'

const ATTRIBUTE_NAMES: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  contenteditable: 'contentEditable',
  crossorigin: 'crossOrigin',
  srcset: 'srcSet',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  spellcheck: 'spellCheck'
}

const VOID_ELEMENTS =
  /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s[^<>]*?)?>/gi

const styleToJsx = (style: string): string => {
  const properties = style
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(':')
      if (separator === -1) return null

      const rawName = declaration.slice(0, separator).trim()
      const value = declaration.slice(separator + 1).trim()
      const name = rawName.startsWith('--')
        ? JSON.stringify(rawName)
        : rawName
            .replace(/^-(ms)-/, '$1-')
            .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())

      return `${name}: ${JSON.stringify(value)}`
    })
    .filter((property): property is string => property !== null)

  return `style={{ ${properties.join(', ')} }}`
}

const htmlToJsx: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') return ''

  let output = text.replace(/<!--([\s\S]*?)-->/g, (_, comment: string) => `{/*${comment}*/}`)

  for (const [htmlName, jsxName] of Object.entries(ATTRIBUTE_NAMES)) {
    output = output.replace(new RegExp(`\\b${htmlName}(?=\\s*=|\\s|/?>)`, 'gi'), jsxName)
  }

  output = output.replace(/\bstyle=(["'])(.*?)\1/gi, (_, _quote: string, style: string) =>
    styleToJsx(style)
  )

  output = output.replace(VOID_ELEMENTS, (match) => {
    if (/\/\s*>$/.test(match)) return match
    return match.replace(/\s*>$/, ' />')
  })

  return output
}

export default htmlToJsx
