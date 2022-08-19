import { faker } from '@faker-js/faker'

import CommentModel, { IComment } from '../../src/models/comment.model'
import PostModel, { IPost } from '../../src/models/post.model'
import UserModel, { IUser } from '../../src/models/user.model'
import { signAccessToken, signRefreshToken } from '../../src/utils/jwt'

export interface ITestUser extends IUser {
  id: string
  cookies: string[]
}

export interface ITestPost extends IPost {
  id: string
}

export interface ITestComment extends IComment {
  id: string
}

export const createTestUser = async () => {
  const user = await UserModel.create({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'password',
  })

  return {
    ...user.toJSON(),
    id: user.id,
    cookies: [
      `accessToken=${signAccessToken(user.id)}`,
      `refreshToken=${signRefreshToken(user.id)}`,
    ],
  }
}

export const createTestPost = async (user: ITestUser) => {
  const post = await PostModel.create({
    text: faker.lorem.paragraph(),
    author: user.id,
  })

  return {
    ...post.toJSON(),
    id: post.id,
  }
}

export const createTestComment = async (user: ITestUser, post: ITestPost) => {
  const comment = await CommentModel.create({
    text: faker.lorem.paragraph(),
    author: user.id,
    post: post.id,
  })

  return {
    ...comment.toJSON(),
    id: comment.id,
  }
}
