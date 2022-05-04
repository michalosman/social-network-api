import { HydratedDocument } from 'mongoose'
import { IComment } from '../../models/comment.model'
import { IPost } from '../../models/post.model'
import { IUser } from '../../models/user.model'
import { createFakeComment, createFakePost, createFakeUser } from './factories'
import _ from 'lodash'

export const seedDb = async () => {
  const users: HydratedDocument<Omit<IUser, 'password'>>[] = []
  const posts: HydratedDocument<IPost>[] = []
  const comments: HydratedDocument<IComment>[] = []

  for (let i = 0; i < 10; i++) {
    const user = await createFakeUser()
    const post = await createFakePost(user)
    const comment = await createFakeComment(user)
    users.push(_.omit(user, ['password']))
    posts.push(post)
    comments.push(comment)
  }

  return { users, posts, comments }
}

export type seedData = {
  users: HydratedDocument<Omit<IUser, 'password'>>[]
  posts: HydratedDocument<IPost>[]
  comments: HydratedDocument<IComment>[]
}
