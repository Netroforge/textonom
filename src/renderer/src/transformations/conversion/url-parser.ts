import type { TransformationFunction } from '../../types/transformation'

type QueryValue = string | string[]

const safeDecodeURIComponent = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const urlParser: TransformationFunction = async (text: string): Promise<string> => {
  const input = text.trim()
  if (input === '') return ''

  let candidate = input
  if (candidate.startsWith('//')) {
    candidate = `https:${candidate}`
  } else if (!/^[a-z][a-z\d+.-]*:/i.test(candidate) && /^[^\s/]+\.[^\s/]+/.test(candidate)) {
    candidate = `https://${candidate}`
  }

  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    throw new Error('Enter an absolute URL such as https://example.com/path?name=value')
  }

  const query: Record<string, QueryValue> = {}
  for (const [key, value] of url.searchParams) {
    const existing = query[key]
    if (existing === undefined) {
      query[key] = value
    } else if (Array.isArray(existing)) {
      existing.push(value)
    } else {
      query[key] = [existing, value]
    }
  }

  return JSON.stringify(
    {
      href: url.href,
      origin: url.origin,
      protocol: url.protocol.replace(/:$/, ''),
      username: url.username,
      password: url.password,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      pathSegments: url.pathname.split('/').filter(Boolean).map(safeDecodeURIComponent),
      query,
      hash: url.hash.replace(/^#/, '')
    },
    null,
    2
  )
}

export default urlParser
