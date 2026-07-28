import 'reflect-metadata'
import {
  BasicConstraintsExtension,
  ExtendedKeyUsageExtension,
  KeyUsageFlags,
  KeyUsagesExtension,
  SubjectAlternativeNameExtension,
  X509Certificate
} from '@peculiar/x509'
import type { TransformationFunction } from '../../types/transformation'

const toHex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)]
    .map((value) => value.toString(16).padStart(2, '0').toUpperCase())
    .join(':')

const keyUsageNames = (flags: KeyUsageFlags): string[] =>
  Object.entries(KeyUsageFlags)
    .filter((entry): entry is [string, number] => typeof entry[1] === 'number')
    .filter(([, value]) => (flags & value) === value)
    .map(([name]) => name)

const x509Inspect: TransformationFunction = async (text: string): Promise<string> => {
  if (text.trim() === '') return ''

  try {
    const certificate = new X509Certificate(text.trim())
    const now = new Date()
    const san = certificate.getExtension(SubjectAlternativeNameExtension)
    const basicConstraints = certificate.getExtension(BasicConstraintsExtension)
    const keyUsages = certificate.getExtension(KeyUsagesExtension)
    const extendedKeyUsages = certificate.getExtension(ExtendedKeyUsageExtension)
    const selfSigned = await certificate.isSelfSigned().catch(() => null)

    return JSON.stringify(
      {
        subject: certificate.subject,
        subjectFields: certificate.subjectName.toJSON(),
        issuer: certificate.issuer,
        issuerFields: certificate.issuerName.toJSON(),
        serialNumber: certificate.serialNumber,
        validity: {
          notBefore: certificate.notBefore.toISOString(),
          notAfter: certificate.notAfter.toISOString(),
          status:
            now < certificate.notBefore
              ? 'not-yet-valid'
              : now > certificate.notAfter
                ? 'expired'
                : 'valid',
          daysRemaining: Math.floor(
            (certificate.notAfter.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
          )
        },
        selfSigned,
        signatureAlgorithm: certificate.signatureAlgorithm,
        publicKeyAlgorithm: certificate.publicKey.algorithm,
        sha256Fingerprint: toHex(await certificate.getThumbprint('SHA-256')),
        subjectAlternativeNames: san?.names.toJSON() ?? [],
        basicConstraints: basicConstraints
          ? { certificateAuthority: basicConstraints.ca, pathLength: basicConstraints.pathLength }
          : null,
        keyUsages: keyUsages ? keyUsageNames(keyUsages.usages) : [],
        extendedKeyUsages: extendedKeyUsages?.usages ?? [],
        extensions: certificate.extensions.map((extension) => ({
          oid: extension.type,
          critical: extension.critical,
          valueBytes: extension.value.byteLength
        }))
      },
      null,
      2
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse X.509 certificate: ${message}`)
  }
}

export default x509Inspect
