import { Base64 } from 'js-base64'
import type { TransformationFunction } from '../../types/transformation'

const readStream = async (readable: ReadableStream<Uint8Array>): Promise<Uint8Array> => {
  const buffer = await new Response(readable).arrayBuffer()
  return new Uint8Array(buffer)
}

const transformBytes = async (
  input: Uint8Array<ArrayBuffer>,
  stream: {
    readable: ReadableStream<Uint8Array>
    writable: WritableStream<BufferSource>
  }
): Promise<Uint8Array> => {
  const writer = stream.writable.getWriter()
  const write = (async () => {
    await writer.write(input)
    await writer.close()
  })()
  const [output] = await Promise.all([readStream(stream.readable), write])
  return output
}

const gzipCompress: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') return ''

  try {
    const compression = new CompressionStream('gzip')
    return Base64.fromUint8Array(await transformBytes(new TextEncoder().encode(text), compression))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to GZIP-compress text: ${message}`)
  }
}

const gzipDecompress: TransformationFunction = async (text: string): Promise<string> => {
  if (text.trim() === '') return ''

  try {
    const compressed = Base64.toUint8Array(text.replace(/\s+/g, ''))
    if (compressed.length === 0) {
      throw new Error('input is not valid Base64')
    }

    const payload = new Uint8Array(compressed.length)
    payload.set(compressed)
    const decompression = new DecompressionStream('gzip')
    const plain = await transformBytes(payload, decompression)
    return new TextDecoder('utf-8', { fatal: true }).decode(plain)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to decompress Base64 GZIP data: ${message}`)
  }
}

export { gzipCompress, gzipDecompress }
