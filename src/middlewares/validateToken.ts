/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'express-async-errors'

import { NextFunction, Request, Response } from 'express'

import { ACCESS_TOKEN } from '../configs/constants'
import UserModel from '../models/user.model'
import { NotFound } from '../utils/errors'
import {
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/jwt'

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.cookies

  if (!accessToken || !refreshToken) return next()

  const { payload: accessPayload, expired: accessExpired } =
    verifyAccessToken(accessToken)

  if (accessPayload) {
    res.locals.user = accessPayload
    return next()
  }

  if (accessExpired) {
    const { payload: refreshPayload } = verifyRefreshToken(refreshToken)

    if (!refreshPayload) return next()

    // @ts-ignore
    const { id: userId } = refreshPayload

    const user = await UserModel.findById(userId)
    if (!user) {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      throw new NotFound('User not found')
    }

    const isSessionValid = Boolean(
      user.sessions.find((token) => token === refreshToken)
    )

    if (isSessionValid) {
      const newAccessToken = signAccessToken(userId)

      res.cookie('accessToken', newAccessToken, {
        maxAge: ACCESS_TOKEN.COOKIE_TTL,
        httpOnly: true,
      })

      res.locals.user = refreshPayload
    }
  }
  return next()
}

export default validateToken
