import type { TransformationFunction } from '../../types/transformation'

const crc32Table = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let crc = i
  for (let j = 0; j < 8; j++) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
  }
  crc32Table[i] = crc
}

export const crc32Hash: TransformationFunction = async (text: string) => {
  if (!text) return ''
  let crc = 0xffffffff
  for (let i = 0; i < text.length; i++) {
    crc = crc32Table[(crc ^ text.charCodeAt(i)) & 0xff] ^ (crc >>> 8)
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).toLowerCase().padStart(8, '0')
}

export const crc16Hash: TransformationFunction = async (text: string) => {
  if (!text) return ''
  let crc = 0xffff
  for (let i = 0; i < text.length; i++) {
    crc ^= text.charCodeAt(i)
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xa001 : crc >>> 1
    }
  }
  return (crc >>> 0).toString(16).toLowerCase().padStart(4, '0')
}
