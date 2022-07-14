import { sanitizeUsers } from './../utils/sanitization'
import { sanitizeUser } from '../utils/sanitization'
import { BadRequest, Unauthorized } from './../utils/errors'
import { Conflict, NotFound } from '../utils/errors'
import UserModel, { IUser } from './../models/user.model'
import { signAccessToken, signRefreshToken } from '../utils/jwt'
import 'express-async-errors'

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

  static async requestFriend(userId: string, requestedId: string) {
    if (userId === requestedId)
      throw new BadRequest('Cannot request friend with yourself')

    const user = await UserModel.findById(userId)
    const requested = await UserModel.findById(requestedId)

    if (!user || !requested) throw new NotFound('User not found')

    if (user.friends.includes(requested.id))
      throw new Conflict('Already friends')

    if (
      requested.friendRequests.includes(user.id) ||
      user.friendRequests.includes(requested.id)
    )
      throw new Conflict('Already requested')

    requested.friendRequests = [...requested.friendRequests, user.id]
    await requested.save()

    return sanitizeUser(requested)
  }

  static async acceptFriend(userId: string, acceptedId: string) {
    const user = await UserModel.findById(userId)
    const accepted = await UserModel.findById(acceptedId)

    if (!user || !accepted) throw new NotFound('User not found')

    if (!user.friendRequests.includes(accepted.id))
      throw new Conflict('No pending friend request')

    user.friends = [...user.friends, accepted.id]
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== accepted.id
    )
    await user.save()

    accepted.friends = [...accepted.friends, user.id]
    await accepted.save()

    return sanitizeUser(accepted)
  }

  static async rejectFriend(userId: string, rejectedId: string) {
    const user = await UserModel.findById(userId)
    const rejected = await UserModel.findById(rejectedId)

    if (!user || !rejected) throw new NotFound('User not found')

    if (!user.friendRequests.includes(rejected.id))
      throw new Conflict('No pending friend request')

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== rejected.id
    )
    await user.save()

    return sanitizeUser(rejected)
  }

  static async removeFriend(userId: string, removedId: string) {
    const user = await UserModel.findById(userId)
    const removed = await UserModel.findById(removedId)

    if (!user || !removed) throw new NotFound('User not found')

    if (!user.friends.includes(removed.id)) throw new Conflict('Not friends')

    user.friends = user.friends.filter((id) => id.toString() !== removed.id)
    await user.save()

    removed.friends = removed.friends.filter((id) => id.toString() !== user.id)
    await removed.save()

    return sanitizeUser(removed)
  }
}
