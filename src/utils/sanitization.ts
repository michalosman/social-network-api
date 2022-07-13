import _ from 'lodash'
import { HydratedDocument } from 'mongoose'
import { IUser } from '../models/user.model'

export const sanitizeUser = (user: HydratedDocument<IUser>) => {
  return _.omit(user.toJSON(), ['password', 'sessions'])
}

export const sanitizeUsers = (users: HydratedDocument<IUser>[]) => {
  return users.map((user) => sanitizeUser(user))
}
