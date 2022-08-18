import 'dotenv/config'

export const PORT = process.env.PORT || 5000

export const NODE_ENV = process.env.NODE_ENV || 'development'

export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

export const MONGO_URI =
  process.env.NODE_ENV === 'production'
    ? (process.env.MONGO_URI_PROD as string)
    : (process.env.MONGO_URI_DEV as string)

export const ACCESS_TOKEN = {
  TTL: '5s',
  COOKIE_TTL: 3.155e10, // 1 year
  PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY || '',
  PUBLIC_KEY: process.env.ACCESS_TOKEN_PUBLIC_KEY || '',
}

export const REFRESH_TOKEN = {
  TTL: '365d',
  COOKIE_TTL: 3.155e10, // 1 year
  PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY || '',
  PUBLIC_KEY: process.env.REFRESH_TOKEN_PUBLIC_KEY || '',
}
