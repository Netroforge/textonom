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

let worker: Worker | null = null
let nextId = 1
const pending = new Map<number, { resolve: (v: string) => void; reject: (e: Error) => void }>()

const getWorker = (): Worker => {
  if (worker) return worker
  worker = new Worker(new URL('./hash.worker.ts', import.meta.url), { type: 'module' })
  worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
    const data = event.data
    const handlers = pending.get(data.id)
    if (!handlers) return
    pending.delete(data.id)
    if (data.ok) handlers.resolve(data.result)
    else handlers.reject(new Error(data.error))
  })
  worker.addEventListener('error', (event) => {
    for (const [, handlers] of pending) {
      handlers.reject(new Error(event.message || 'Worker error'))
    }
    pending.clear()
  })
  return worker
}

const send = <T extends Omit<WorkerRequest, 'id'>>(req: T): Promise<string> => {
  const id = nextId++
  const w = getWorker()
  return new Promise<string>((resolve, reject) => {
    pending.set(id, { resolve, reject })
    w.postMessage({ ...req, id })
  })
}

export const bcryptInWorker = (text: string, rounds: number): Promise<string> =>
  send({ kind: 'bcrypt', text, rounds })

export const pbkdf2InWorker = (
  text: string,
  algorithm: 'SHA1' | 'SHA256' | 'SHA512',
  iterations: number,
  keyLength: number,
  salt: string
): Promise<string> => send({ kind: 'pbkdf2', text, algorithm, iterations, keyLength, salt })
