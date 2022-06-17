import { Request, Response } from 'express'
import UserService from '../services/user.service'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../configs/constants'

export default class UserController {
  static async register(req: Request, res: Response) {
    const user = await UserService.register(req.body)
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

  static async getAll(req: Request, res: Response) {
    const users = await UserService.getAll()
    res.json(users)
  }

  static async get(req: Request, res: Response) {
    const { id } = req.params
    const user = await UserService.get(id)
    res.json(user)
  }

  static async requestFriend(req: Request, res: Response) {
    const { id: userId } = res.locals.user
    const { id: requestedId } = req.params

    const requested = await UserService.requestFriend(userId, requestedId)

    res.json(requested)
  }

  static async acceptFriend(req: Request, res: Response) {
    // TODO
  }

  static async rejectFriend(req: Request, res: Response) {
    // TODO
  }

  static async removeFriend(req: Request, res: Response) {
    // TODO
  }
}
