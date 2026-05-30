import cronstrue from 'cronstrue'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Converts cron expressions (one per line) into human-readable descriptions.
 */
const cronToHuman: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  return text
    .split('\n')
    .map((raw) => {
      const line = raw.trim()
      if (!line) return ''
      try {
        return cronstrue.toString(line, { throwExceptionOnParseError: true })
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Invalid cron expression "${raw}": ${message}`)
      }
    })
    .join('\n')
}

export default cronToHuman
