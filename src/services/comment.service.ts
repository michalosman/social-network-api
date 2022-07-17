import CommentModel from '../models/comment.model'
import PostModel from '../models/post.model'
import UserModel from '../models/user.model'
import { NotFound } from './../utils/errors'

export default class CommentService {
  static async create(text: string, authorId: string, postId: string) {
    const author = await UserModel.findById(authorId)
    if (!author) throw new NotFound('User not found')

    const post = await PostModel.findById(postId)
    if (!post) throw new NotFound('Post not found')

    const comment = await CommentModel.create({
      text,
      author: author.id,
      post: post.id,
    })

    post.comments = [...post.comments, comment.id]
    await post.save()

    return comment
  }
}
