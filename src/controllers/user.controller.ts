import { Request, Response } from 'express'
import UserService from '../services/user.service'

export default class UserController {
  static async register(req: Request, res: Response) {
    const user = await UserService.register(req.body)
    res.json({ data: user })
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body
    const user = await UserService.login(email, password)
    res.json({ data: user })
  }

  static async getAll(req: Request, res: Response) {
    // TODO
  }

  static async get(req: Request, res: Response) {
    // TODO
  }

  static async requestFriend(req: Request, res: Response) {
    // TODO
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
