import { HydratedDocument } from 'mongoose'
import { IComment } from '../../models/comment.model'
import { IPost } from '../../models/post.model'
import { IUser } from '../../models/user.model'
import { createFakeComment, createFakePost, createFakeUser } from './factories'

export const seedDb = async () => {
  const users: HydratedDocument<IUser>[] = []
  const posts: HydratedDocument<IPost>[] = []
  const comments: HydratedDocument<IComment>[] = []

  for (let i = 0; i < 30; i++) {
    const user = await createFakeUser()
    const post = await createFakePost(user)
    const comment = await createFakeComment(user)
    users.push(user)
    posts.push(post)
    comments.push(comment)
  }

  return { users, posts, comments }
}
