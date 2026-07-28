import { serialize, unserialize } from 'php-serialize'
import type { TransformationFunction } from '../../types/transformation'

const phpSerialize: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return serialize(JSON.parse(text))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to serialize JSON as PHP: ${message}`)
  }
}

const phpUnserialize: TransformationFunction = async (text: string): Promise<string> => {
  try {
    return JSON.stringify(unserialize(text), null, 2)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to unserialize PHP data: ${message}`)
  }
}

export { phpSerialize, phpUnserialize }
