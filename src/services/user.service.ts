import 'express-async-errors'

import { Types } from 'mongoose'

import { MY_USER_ID, TEST_USER_ID } from '../configs/constants'
import UserModel from '../models/user.model'
import {
  BadRequest,
  Conflict,
  MethodNotAllowed,
  NotFound,
  Unauthorized,
} from '../utils/errors'
import { signAccessToken, signRefreshToken } from '../utils/jwt'
import { sanitizeUser } from '../utils/sanitization'

export default class UserService {
  static async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const doesExist = await UserModel.findOne({ email })
    if (doesExist) throw new Conflict('Email address is already taken')

    const user = new UserModel({
      firstName,
      lastName,
      email,
      password,
    })

    if (MY_USER_ID) user.friendRequests.push(new Types.ObjectId(MY_USER_ID))

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

  static async login(email: string, password: string) {
    const user = await UserModel.findOne({ email })
      .populate({ path: 'friends', select: ['-password', '-sessions'] })
      .populate({ path: 'friendRequests', select: ['-password', '-sessions'] })
    if (!user) throw new NotFound('User with given email does not exist')

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) throw new Unauthorized('Wrong password')

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

  static async get(userId: string) {
    const user = await UserModel.findById(userId)
      .populate({ path: 'friends', select: ['-password', '-sessions'] })
      .populate({ path: 'friendRequests', select: ['-password', '-sessions'] })

    if (!user) throw new NotFound('User not found')

    return sanitizeUser(user)
  }

  static async getSearched(firstName: string, lastName: string, limit: number) {
    if (limit < 0 || Number.isNaN(limit))
      throw new BadRequest('Must provide limit in query string')

    const users = await UserModel.find({
      $and: [
        { firstName: { $regex: new RegExp(firstName, 'i') } },
        { firstName: { $ne: 'Test' } },
      ],
      lastName: { $regex: new RegExp(lastName, 'i') },
    })
      .select(['-password', '-sessions'])
      .limit(limit)
      .sort({
        firstName: 'asc',
        lastName: 'asc',
      })

    return users
  }

  static async update(
    userId: string,
    updatedFields: {
      firstName?: string
      lastName?: string
      email?: string
      password?: string
      image?: string
    }
  ) {
    if (userId === TEST_USER_ID)
      throw new MethodNotAllowed('Cannot modify test user data')

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updatedFields,
      {
        new: true,
      }
    )

    if (!updatedUser) throw new NotFound('User not found')

    return sanitizeUser(updatedUser)
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

    if (userId === TEST_USER_ID && removed.firstName === 'Test')
      throw new MethodNotAllowed('Cannot remove test user friends')

    user.friends = user.friends.filter((id) => id.toString() !== removed.id)
    await user.save()

    removed.friends = removed.friends.filter((id) => id.toString() !== user.id)
    await removed.save()

    return sanitizeUser(removed)
  }
}
