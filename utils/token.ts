import { randomBytes } from 'crypto'

export function genCSecret(): string {
  const buffer = randomBytes(32)
  return buffer.toString('hex')
}

export function getUnixMilliseconds(): string {
  const now = new Date()
  return now.getTime().toString()
}

export function getInfiniteExpiryMagic(): string {
  return `-1`
}
