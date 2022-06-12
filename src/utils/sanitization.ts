/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash'
import { Document } from 'mongoose'
import { UserDocument } from '../models/user.model'

export const sanitizeUser = (user: Document<unknown, any, UserDocument>) => {
  return _.omit(user.toJSON(), ['password', 'sessions'])
}

export const sanitizeUsers = (
  users: Document<unknown, any, UserDocument>[]
) => {
  return users.map((user) => sanitizeUser(user))
}
