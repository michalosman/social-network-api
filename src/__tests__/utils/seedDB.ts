import {
  createTestComment,
  createTestPost,
  createTestUser,
  ITestComment,
  ITestPost,
  ITestUser,
} from './factories'

export const seedDB = async () => {
  const users: ITestUser[] = []
  const posts: ITestPost[] = []
  const comments: ITestComment[] = []

  for (let i = 0; i < 30; i++) {
    const user = await createTestUser()
    const post = await createTestPost(user)
    const comment = await createTestComment(user, post)
    users.push(user)
    posts.push(post)
    comments.push(comment)
  }

  return {
    users,
    posts,
    comments,
  }
}
