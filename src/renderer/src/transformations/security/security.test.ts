import { describe, expect, it } from 'vitest'
import {
  atbashCipher,
  hashIdentify,
  ipv4CidrInspect,
  x509Inspect,
  xorDecrypt,
  xorEncrypt
} from '@renderer/transformations/security'

const TEST_CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIIDYDCCAkigAwIBAgIUIT9c5z/kttiuPAkZCI6asSBwllQwDQYJKoZIhvcNAQEL
BQAwLTEWMBQGA1UEAwwNdGV4dG9ub20udGVzdDETMBEGA1UECgwKTmV0cm9mb3Jn
ZTAeFw0yNjA3MjgxODI3MDhaFw0yNjA4MjcxODI3MDhaMC0xFjAUBgNVBAMMDXRl
eHRvbm9tLnRlc3QxEzARBgNVBAoMCk5ldHJvZm9yZ2UwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQC6ez4aN+GjLlrSW32RjUAufxyEvwye74chD1qqrWUe
OMmVf9xRmz6WYD5TIWy8CKK2BHf8ZAfn5OuHbgVpsxLhx+y9FxT6E1UI15Urghiz
LlvVsYzAutDpj3jsqaFXcPj/kTleLkMt3bI/naAAyczJOfs+IM748nLe1efemC3J
nekhrJLm4lx0zw9kl72AFQA3n07jL2f7MdQBk2yrC7UJCM0M9IdAiyusBQRLHU7x
Qae9C3eE0m5qf/ffpE4NhtTe2FGKfm+erY1g0Y7e0yUa57dczA6F0am9ErvIoBOe
0TpT0rauV3csIbHCyxEo6xfKXVWTYx5TzT5YLt/eYGQZAgMBAAGjeDB2MB0GA1Ud
DgQWBBT5jBnVK3qHcVKxpi7AGxe5NCCaQDAfBgNVHSMEGDAWgBT5jBnVK3qHcVKx
pi7AGxe5NCCaQDAPBgNVHRMBAf8EBTADAQH/MCMGA1UdEQQcMBqCDXRleHRvbm9t
LnRlc3SCCWxvY2FsaG9zdDANBgkqhkiG9w0BAQsFAAOCAQEAswdISkFTuREiVPyo
m2Y6R/KPUxi15/+Lse0cxjr4u1WUI9X/Yvtt2bUQzjSrd53pY+45bwUkNHa7wj/7
zfzc6fUUnpcfpwbltmcvf6yds5eu481FEyhYY8eKvY6t6kfTp7/sbzZVdoYD0Q2m
lRnu539haBVzIbE9LsYyLwT8orbgNrEJWDTPq6r5wXCEfq/Llahe9sn54aQ9k9TN
u153g/Pcl0vQBr5wP/sgHB30RcvGokJe5qgysk/6E/KBmxTvHtIiIewSvpJkRbze
KJT+G4UdnyGPF1YvYJX2qCY1qd4EaJaAxg4F9+HS0lOVga/I9bO+4P9xBBl4myCq
bUt+8A==
-----END CERTIFICATE-----`

describe('security transformations', () => {
  it('round-trips Atbash', async () => {
    expect(await atbashCipher(await atbashCipher('Hello, Zebra!'))).toBe('Hello, Zebra!')
  })

  it('round-trips XOR with text and hex keys', async () => {
    const encrypted = await xorEncrypt('private payload 🎉', { key: 'secret' })
    expect(await xorDecrypt(encrypted, { key: 'secret' })).toBe('private payload 🎉')

    const hexEncrypted = await xorEncrypt('hello', { key: '0102', keyEncoding: 'hex' })
    expect(await xorDecrypt(hexEncrypted, { key: '0102', keyEncoding: 'hex' })).toBe('hello')
  })

  it('inspects IPv4 CIDR networks', async () => {
    const result = JSON.parse(await ipv4CidrInspect('192.168.10.42/24'))
    expect(result).toMatchObject({
      network: '192.168.10.0',
      broadcast: '192.168.10.255',
      subnetMask: '255.255.255.0',
      usableHostCount: 254,
      private: true
    })
  })

  it('rejects malformed CIDR input', async () => {
    await expect(ipv4CidrInspect('192.168.1.1/24/extra')).rejects.toThrow('optional CIDR prefix')
  })

  it('identifies common hash families without claiming certainty', async () => {
    const result = JSON.parse(await hashIdentify('d41d8cd98f00b204e9800998ecf8427e'))
    expect(result[0].candidates).toEqual(['MD5', 'NTLM'])
  })

  it('inspects X.509 identity, validity, fingerprints, and SANs', async () => {
    const result = JSON.parse(await x509Inspect(TEST_CERTIFICATE))
    expect(result.subject).toContain('CN=textonom.test')
    expect(result.sha256Fingerprint).toMatch(/^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/)
    expect(result.subjectAlternativeNames).toEqual(
      expect.arrayContaining([
        { type: 'dns', value: 'textonom.test' },
        { type: 'dns', value: 'localhost' }
      ])
    )
    expect(result.selfSigned).toBe(true)
  })
})
