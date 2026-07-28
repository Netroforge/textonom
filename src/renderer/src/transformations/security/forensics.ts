import type { TransformationFunction } from '../../types/transformation'

const ipv4ToNumber = (address: string): number => {
  const parts = address.split('.')
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part) || Number(part) > 255)) {
    throw new Error(`Invalid IPv4 address: ${address}`)
  }
  return parts.reduce((value, part) => (value * 256 + Number(part)) >>> 0, 0)
}

const numberToIpv4 = (value: number): string =>
  [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join('.')

const ipv4CidrInspect: TransformationFunction = async (text: string): Promise<string> => {
  const input = text.trim()
  if (!input) return ''

  const parts = input.split('/')
  if (parts.length > 2) throw new Error('Enter one IPv4 address with an optional CIDR prefix')
  const [addressText, prefixText = '32'] = parts
  const prefix = Number(prefixText)
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    throw new Error('CIDR prefix must be an integer from 0 to 32')
  }

  const address = ipv4ToNumber(addressText)
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = (address & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const addressCount = 2 ** (32 - prefix)
  const firstHost = prefix >= 31 ? network : network + 1
  const lastHost = prefix >= 31 ? broadcast : broadcast - 1

  return JSON.stringify(
    {
      input,
      address: numberToIpv4(address),
      prefix,
      subnetMask: numberToIpv4(mask),
      network: numberToIpv4(network),
      broadcast: numberToIpv4(broadcast),
      firstHost: numberToIpv4(firstHost),
      lastHost: numberToIpv4(lastHost),
      addressCount,
      usableHostCount: prefix === 32 ? 1 : prefix === 31 ? 2 : Math.max(0, addressCount - 2),
      private:
        (address >= ipv4ToNumber('10.0.0.0') && address <= ipv4ToNumber('10.255.255.255')) ||
        (address >= ipv4ToNumber('172.16.0.0') && address <= ipv4ToNumber('172.31.255.255')) ||
        (address >= ipv4ToNumber('192.168.0.0') && address <= ipv4ToNumber('192.168.255.255'))
    },
    null,
    2
  )
}

const HASH_CANDIDATES: Record<number, string[]> = {
  8: ['CRC32'],
  32: ['MD5', 'NTLM'],
  40: ['SHA-1', 'RIPEMD-160'],
  56: ['SHA-224'],
  64: ['SHA-256', 'SHA3-256', 'Keccak-256'],
  96: ['SHA-384', 'SHA3-384'],
  128: ['SHA-512', 'SHA3-512']
}

const hashIdentify: TransformationFunction = async (text: string): Promise<string> => {
  const results = text
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      const bcrypt = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value)
      const argon2 = /^\$argon2(?:id|i|d)\$/.test(value)
      const hex = /^[0-9a-fA-F]+$/.test(value)
      const candidates = bcrypt
        ? ['bcrypt']
        : argon2
          ? ['Argon2']
          : hex
            ? (HASH_CANDIDATES[value.length] ?? [])
            : []
      return { value, length: value.length, encoding: hex ? 'hex' : 'modular', candidates }
    })

  return JSON.stringify(results, null, 2)
}

export { hashIdentify, ipv4CidrInspect }
