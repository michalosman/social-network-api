import { sanitizeUsers } from './../utils/sanitization'
import { sanitizeUser } from '../utils/sanitization'
import { Unauthorized } from './../utils/errors'
import { Conflict, NotFound } from '../utils/errors'
import UserModel, { IUser } from './../models/user.model'
import { signAccessToken, signRefreshToken } from '../utils/jwt'

export default class UserService {
  static async register(user: IUser) {
    const doesExist = await UserModel.findOne({ email: user.email })
    if (doesExist) throw new Conflict('User already exists')

    const newUser = await UserModel.create(user)

    return sanitizeUser(newUser)
  }

  static async login(email: string, password: string) {
    const user = await UserModel.findOne({ email })
    if (!user) throw new NotFound('User does not exist')

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) throw new Unauthorized('Invalid password')

    const accessToken = signAccessToken(user.id)
    const refreshToken = signRefreshToken(user.id)

    user.sessions = [...user.sessions, refreshToken]
    await user.save()

    return {
      ...sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  static async logout(userId: string, refreshToken: string) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { sessions: refreshToken },
      },
      {
        new: true,
      }
    )

    if (!user) throw new NotFound('User not found')

    return sanitizeUser(user)
  }

  static async logoutAll(userId: string) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: { sessions: [] },
      },
      {
        new: true,
      }
    )

    if (!user) throw new NotFound('User not found')

    return sanitizeUser(user)
  }

  static async getAll() {
    const users = await UserModel.find()
    return sanitizeUsers(users)
  }

  static async get(userId: string) {
    const user = await UserModel.findById(userId)

    if (!user) throw new NotFound('User not found')

    return sanitizeUser(user)
  }

  static async requestFriend(requesterId: string, requestedId: string) {
    // TODO
  }

  static async acceptFriend(accepterId: string, acceptedId: string) {
    // TODO
  }

  static async rejectFriend(rejecterId: string, rejectedId: string) {
    // TODO
  }

  static async removeFriend(removerId: string, removedId: string) {
    // TODO
  }
}
