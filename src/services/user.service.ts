import { Unauthorized } from './../utils/errors'
import { Conflict, NotFound } from '../utils/errors'
import UserModel, { IUser } from './../models/user.model'
import 'express-async-errors'
import _ from 'lodash'

export default class UserService {
  static async register(user: IUser) {
    const doesExist = await UserModel.findOne({ email: user.email })
    if (doesExist) throw new Conflict('User already exists')

    const newUser = await UserModel.create(user)

    return _.omit(newUser.toJSON(), ['password'])
  }

  static async login(email: string, password: string) {
    const user = await UserModel.findOne({ email })
    if (!user) throw new NotFound('User does not exist')

    const isPasswordValid = await user.isPasswordValid(password)
    if (!isPasswordValid) throw new Unauthorized('Invalid password')

    return _.omit(user.toJSON(), ['password'])
  }

  static async getAll() {
    // TODO
  }

  static async get(id: string) {
    // TODO
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
