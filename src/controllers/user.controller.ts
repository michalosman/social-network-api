import { Request, Response } from 'express'

import { ACCESS_TOKEN, REFRESH_TOKEN } from '../configs/constants'
import UserService from '../services/user.service'

export default class UserController {
  static async register(req: Request, res: Response) {
    const userData = req.body

    const user = await UserService.register(userData)

    res.json(user)
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body

    const { accessToken, refreshToken, ...user } = await UserService.login(
      email,
      password
    )

    res.cookie('accessToken', accessToken, {
      maxAge: ACCESS_TOKEN.COOKIE_TTL,
      httpOnly: true,
    })
    res.cookie('refreshToken', refreshToken, {
      maxAge: REFRESH_TOKEN.COOKIE_TTL,
      httpOnly: true,
    })

    res.json(user)
  }

  static async logout(req: Request, res: Response) {
    const { id } = res.locals.user
    const { refreshToken } = req.cookies

    const user = await UserService.logout(id, refreshToken)

    res.cookie('accessToken', '', {
      maxAge: 0,
      httpOnly: true,
    })
    res.cookie('refreshToken', '', {
      maxAge: 0,
      httpOnly: true,
    })

    res.json(user)
  }

  static async logoutAll(req: Request, res: Response) {
    const { id } = res.locals.user

    const user = await UserService.logoutAll(id)

    res.cookie('accessToken', '', {
      maxAge: 0,
    })
    res.cookie('refreshToken', '', {
      maxAge: 0,
    })

    res.json(user)
  }

  static async getSearched(req: Request, res: Response) {
    const { firstName, lastName, limit } = req.query

    const users = await UserService.getSearched(
      firstName as string,
      lastName as string,
      parseInt(limit as string)
    )

    res.json(users)
  }

  static async getProfile(req: Request, res: Response) {
    const { id } = req.params

    const user = await UserService.getProfile(id)

    res.json(user)
  }

  static async requestFriend(req: Request, res: Response) {
    const { id: userId } = res.locals.user
    const { id: requestedId } = req.params

    const requested = await UserService.requestFriend(userId, requestedId)

    res.json(requested)
  }

  static async acceptFriend(req: Request, res: Response) {
    const { id: userId } = res.locals.user
    const { id: acceptedId } = req.params

    const accepted = await UserService.acceptFriend(userId, acceptedId)

    res.json(accepted)
  }

  static async rejectFriend(req: Request, res: Response) {
    const { id: userId } = res.locals.user
    const { id: rejectedId } = req.params

    const rejected = await UserService.rejectFriend(userId, rejectedId)

    res.json(rejected)
  }

  static async removeFriend(req: Request, res: Response) {
    const { id: userId } = res.locals.user
    const { id: removedId } = req.params

    const removed = await UserService.removeFriend(userId, removedId)

    res.json(removed)
  }
}
