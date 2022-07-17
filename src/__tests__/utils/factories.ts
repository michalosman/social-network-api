import { faker } from '@faker-js/faker'

import CommentModel, { IComment } from '../../models/comment.model'
import PostModel, { IPost } from '../../models/post.model'
import UserModel, { IUser } from '../../models/user.model'
import { signAccessToken, signRefreshToken } from '../../utils/jwt'

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

export const createTestUser = async (): Promise<ITestUser> => {
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

export const createTestPost = async (user: ITestUser): Promise<ITestPost> => {
  const post = await PostModel.create({
    text: faker.lorem.paragraph(),
    author: user.id,
  })
  return {
    ...post.toJSON(),
    id: post.id,
  }
}

export const createTestComment = async (
  user: ITestUser,
  post: ITestPost
): Promise<ITestComment> => {
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
