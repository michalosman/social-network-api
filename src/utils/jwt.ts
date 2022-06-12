import { ACCESS_TOKEN, REFRESH_TOKEN } from '../configs/constants'
import jwt from 'jsonwebtoken'

export const signAccessToken = (id: string) => {
  return jwt.sign({ id }, ACCESS_TOKEN.PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: ACCESS_TOKEN.TTL,
  })
}

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN.PUBLIC_KEY)
    return { payload: decoded, expired: false }
  } catch (error) {
    return { payload: null, expired: error.message.includes('jwt expired') }
  }
}

export const signRefreshToken = (id: string) => {
  return jwt.sign({ id }, REFRESH_TOKEN.PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: REFRESH_TOKEN.TTL,
  })
}

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN.PUBLIC_KEY)
    return { payload: decoded, expired: false }
  } catch (error) {
    return { payload: null, expired: error.message.includes('jwt expired') }
  }
}
