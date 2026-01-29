import jwt, { SignOptions } from 'jsonwebtoken'

export const signJwt = (
  payload: Object,
  additionalStr: string,
  keyName: 'accessTokenPrivateKey',
  options: SignOptions,
) => {
  const privateKey = process.env[
    keyName === 'accessTokenPrivateKey' ? 'JWT_ACCESS_TOKEN_PRIVATE_KEY' : ''
  ] as string

  return jwt.sign(payload, `${privateKey}${additionalStr}`, {
    ...(options && options),
  })
}

export const signJwtForApp = (
  payload: Object,
  additionalStr: string,
  options: SignOptions,
) => {
  return jwt.sign(payload, additionalStr, {
    ...(options && options),
  })
}

export const verifyJwt = <T>(
  token: string,
  additionalStr: string,
  keyName: 'accessTokenPublicKey',
): T | null => {
  try {
    const publicKey = process.env[
      keyName === 'accessTokenPublicKey' ? 'JWT_ACCESS_TOKEN_PRIVATE_KEY' : ''
    ] as string
    const decoded = jwt.verify(token, `${publicKey}${additionalStr}`) as T
    return decoded
  } catch (error) {
    console.log(error)
    return null
  }
}
