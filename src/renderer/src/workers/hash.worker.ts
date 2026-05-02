import * as bcrypt from 'bcryptjs'
import * as CryptoJS from 'crypto-js'

type BcryptRequest = {
  id: number
  kind: 'bcrypt'
  text: string
  rounds: number
}

type Pbkdf2Request = {
  id: number
  kind: 'pbkdf2'
  text: string
  algorithm: 'SHA1' | 'SHA256' | 'SHA512'
  iterations: number
  keyLength: number
  salt: string
}

type WorkerRequest = BcryptRequest | Pbkdf2Request

type WorkerResponse =
  | { id: number; ok: true; result: string }
  | { id: number; ok: false; error: string }

const ctx = self as unknown as Worker

const handleBcrypt = (msg: BcryptRequest): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.hash(msg.text, msg.rounds, (err, hash) => {
      if (err) reject(new Error(err.message))
      else if (!hash) reject(new Error('No hash returned'))
      else resolve(hash)
    })
  })

const handlePbkdf2 = (msg: Pbkdf2Request): string => {
  const salt = msg.salt ? CryptoJS.enc.Utf8.parse(msg.salt) : CryptoJS.lib.WordArray.random(16)
  const hasher =
    msg.algorithm === 'SHA1'
      ? CryptoJS.algo.SHA1
      : msg.algorithm === 'SHA512'
        ? CryptoJS.algo.SHA512
        : CryptoJS.algo.SHA256
  const derived = CryptoJS.PBKDF2(msg.text, salt, {
    keySize: msg.keyLength / 4,
    iterations: msg.iterations,
    hasher
  })
  return [
    `algorithm=PBKDF2-HMAC-${msg.algorithm}`,
    `iterations=${msg.iterations}`,
    `salt=${salt.toString(CryptoJS.enc.Hex)}`,
    `hash=${derived.toString(CryptoJS.enc.Hex)}`
  ].join('\n')
}

ctx.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data
  try {
    let result: string
    if (msg.kind === 'bcrypt') {
      result = await handleBcrypt(msg)
    } else {
      result = handlePbkdf2(msg)
    }
    const response: WorkerResponse = { id: msg.id, ok: true, result }
    ctx.postMessage(response)
  } catch (error) {
    const response: WorkerResponse = {
      id: msg.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    }
    ctx.postMessage(response)
  }
})
