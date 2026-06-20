import xmlFormat from 'xml-formatter'
import type { TransformationFunction } from '../../types/transformation'

/**
 * Compacts XML by removing whitespace
 */
const xmlCompact: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return xmlFormat.minify(text, {
      filter: (node) => node.type !== 'Comment',
      collapseContent: true
    })
  } catch (error) {
    const err = error as Error
    throw new Error('Failed to compact XML: ' + err.message)
  }
}

export default xmlCompact
