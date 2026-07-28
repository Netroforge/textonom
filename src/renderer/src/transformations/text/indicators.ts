import type { TransformationFunction } from '../../types/transformation'

const defangIndicators: TransformationFunction = async (text: string): Promise<string> => {
  return text
    .replace(/\bhttps:\/\//gi, 'hxxps[://]')
    .replace(/\bhttp:\/\//gi, 'hxxp[://]')
    .replace(/(?<=[A-Za-z0-9])\.(?=[A-Za-z0-9])/g, '[.]')
}

const fangIndicators: TransformationFunction = async (text: string): Promise<string> => {
  return text
    .replace(/\bhxxps(?:\[|\\)?(?::\/\/|:\/\/\]|:\\\/\\\/)(?:\])?/gi, 'https://')
    .replace(/\bhxxp(?:\[|\\)?(?::\/\/|:\/\/\]|:\\\/\\\/)(?:\])?/gi, 'http://')
    .replace(/\[(?:\.|dot)\]|\((?:\.|dot)\)/gi, '.')
}

export { defangIndicators, fangIndicators }
