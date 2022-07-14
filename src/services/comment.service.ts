import { NotFound } from './../utils/errors'
import UserModel from '../models/user.model'
import CommentModel from '../models/comment.model'

export default class CommentService {
  static async create(text: string, authorId: string) {
    const author = await UserModel.findById(authorId)
    if (!author) throw new NotFound('User not found')

    const comment = await CommentModel.create({ text, author: author.id })
    return comment
  }
}
