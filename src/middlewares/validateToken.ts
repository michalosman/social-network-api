import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
} from './../utils/jwt'
import { Request, Response, NextFunction } from 'express'
import UserService from '../services/user.service'

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.cookies

  if (!accessToken || !refreshToken) {
    return next()
  }

  const { payload: accessPayload, expired: accessExpired } =
    verifyAccessToken(accessToken)

  if (accessPayload) {
    res.locals.user = accessPayload
    return next()
  }

  if (!accessExpired) {
    return next()
  }

  const { payload: refreshPayload } = verifyRefreshToken(refreshToken)

  if (!refreshPayload) {
    return next()
  }

  const isSessionValid = await UserService.validateSession(
    // @ts-ignore
    refreshPayload.id,
    refreshToken
  )

  if (!isSessionValid) {
    return next()
  }

  // @ts-ignore
  const newAccessToken = signAccessToken(refreshPayload.id)

  res.cookie('accessToken', newAccessToken, {
    maxAge: 300000, // 5 minutes
    httpOnly: true,
  })

  res.locals.user = verifyAccessToken(newAccessToken).payload

  return next()
}

export default validateToken
