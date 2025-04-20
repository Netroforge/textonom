import type { TransformationFunction } from '../../types'

/**
 * Decodes HTML entities to their corresponding characters
 */
const htmlDecode: TransformationFunction = async (text: string): Promise<string> => {
  const el = document.createElement('div')
  el.innerHTML = text
  return el.innerText
}

export default htmlDecode
