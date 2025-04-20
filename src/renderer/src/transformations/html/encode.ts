import type { TransformationFunction } from '../../types'

/**
 * Encodes HTML special characters
 */
const htmlEncode: TransformationFunction = async (text: string): Promise<string> => {
  const el = document.createElement('div')
  el.innerText = text
  return el.innerHTML
}

export default htmlEncode
