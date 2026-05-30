export const regexReplace = async (
  text: string,
  params?: Record<string, string | number | boolean>
): Promise<string> => {
  if (!text) return ''
  const pattern = params?.pattern as string | undefined
  if (!pattern) throw new Error('Find pattern is required')
  const replacement = (params?.replacement as string) || ''
  const flags = (params?.flags as string) || 'g'

  try {
    const regex = new RegExp(pattern, flags)
    return text.replace(regex, replacement)
  } catch (error) {
    throw new Error(`Invalid regex: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const regexTest = async (
  text: string,
  params?: Record<string, string | number | boolean>
): Promise<string> => {
  if (!text) return ''
  const pattern = params?.pattern as string | undefined
  if (!pattern) throw new Error('Find pattern is required')
  const flags = (params?.flags as string) || 'g'

  try {
    const regex = new RegExp(pattern, flags)
    const matches = [...text.matchAll(regex)]
    if (matches.length === 0) return 'No matches found.'

    return matches
      .map((m, i) => {
        const parts = [`[${i}] "${m[0]}" at index ${m.index}`]
        const groups = m.groups
          ? Object.fromEntries(Object.entries(m.groups).filter(([, v]) => v !== undefined))
          : {}
        if (Object.keys(groups).length > 0) {
          parts.push(`groups: ${JSON.stringify(groups)}`)
        }
        return parts.join(' - ')
      })
      .join('\n')
  } catch (error) {
    throw new Error(`Invalid regex: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
