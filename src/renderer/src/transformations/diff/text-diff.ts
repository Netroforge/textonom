export interface DiffLine {
  type: 'equal' | 'added' | 'removed'
  value: string
  oldLine?: number
  newLine?: number
}

export interface WordSegment {
  text: string
  type: 'equal' | 'added' | 'removed'
}

export function computeTextDiff(oldText: string, newText: string): DiffLine[] {
  if (oldText === newText) {
    const lines = newText === '' ? [''] : newText.split('\n')
    return lines.map((line, idx) => ({
      type: 'equal' as const,
      value: line,
      oldLine: idx + 1,
      newLine: idx + 1
    }))
  }

  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')

  return buildDiff(oldLines, newLines)
}

function buildDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const oldLen = oldLines.length
  const newLen = newLines.length

  const dp: number[][] = []
  for (let i = 0; i <= oldLen; i++) {
    dp.push(new Array(newLen + 1).fill(0))
  }

  for (let i = 1; i <= oldLen; i++) {
    for (let j = 1; j <= newLen; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const result: DiffLine[] = []
  let i = oldLen
  let j = newLen

  const temp: DiffLine[] = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      temp.push({ type: 'equal', value: oldLines[i - 1], oldLine: i, newLine: j })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.push({ type: 'added', value: newLines[j - 1], newLine: j })
      j--
    } else {
      temp.push({ type: 'removed', value: oldLines[i - 1], oldLine: i })
      i--
    }
  }

  for (let k = temp.length - 1; k >= 0; k--) {
    result.push(temp[k])
  }

  return result
}

export function computeWordDiff(oldStr: string, newStr: string): WordSegment[] {
  if (oldStr === newStr) return [{ text: oldStr, type: 'equal' }]
  const oldWords = oldStr.split(/(\s+)/)
  const newWords = newStr.split(/(\s+)/)
  const dp: number[][] = []
  for (let i = 0; i <= oldWords.length; i++) {
    dp.push(new Array(newWords.length + 1).fill(0))
  }
  for (let i = 1; i <= oldWords.length; i++) {
    for (let j = 1; j <= newWords.length; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  const result: WordSegment[] = []
  let i = oldWords.length
  let j = newWords.length
  const temp: WordSegment[] = []
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      temp.push({ text: oldWords[i - 1], type: 'equal' })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.push({ text: newWords[j - 1], type: 'added' })
      j--
    } else {
      temp.push({ text: oldWords[i - 1], type: 'removed' })
      i--
    }
  }
  for (let k = temp.length - 1; k >= 0; k--) {
    result.push(temp[k])
  }
  return result
}

export function formatDiffAsText(diff: DiffLine[]): string {
  let added = 0
  let removed = 0
  const lines = diff.map((line) => {
    if (line.type === 'added') {
      added++
      return `+ ${line.value}`
    }
    if (line.type === 'removed') {
      removed++
      return `- ${line.value}`
    }
    return `  ${line.value}`
  })
  lines.push('')
  lines.push(
    `--- ${added} addition${added !== 1 ? 's' : ''}, ${removed} deletion${removed !== 1 ? 's' : ''}`
  )
  return lines.join('\n')
}
