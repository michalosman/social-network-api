import { faker } from '@faker-js/faker'
import PostModel from '../../models/post.model'
import UserModel, { IUser } from '../../models/user.model'
import CommentModel from '../../models/comment.model'
import { HydratedDocument } from 'mongoose'

export const createFakeUser = async () => {
  const user = new UserModel({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'password',
  })
  return await user.save()
}

export const createFakePost = async (user: HydratedDocument<IUser>) => {
  const post = new PostModel({
    text: faker.lorem.paragraph(),
    author: user._id,
  })
  return await post.save()
}

export const createFakeComment = async (user: HydratedDocument<IUser>) => {
  const comment = new CommentModel({
    text: faker.lorem.paragraph(),
    author: user._id,
  })
  return await comment.save()
}
