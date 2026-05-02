import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

const uuidGenerate: TransformationFunction = async (
  _text: string,
  params?: TransformationParamValues
): Promise<string> => {
  const count = Math.max(1, Math.min(1000, Number(params?.count ?? 1)))
  const uppercase = params?.uppercase === true

  const uuids: string[] = []
  for (let i = 0; i < count; i++) {
    const value = crypto.randomUUID()
    uuids.push(uppercase ? value.toUpperCase() : value)
  }
  return uuids.join('\n')
}

export default uuidGenerate
