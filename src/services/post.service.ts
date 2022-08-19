import 'express-async-errors'

import PostModel from '../models/post.model'
import UserModel from '../models/user.model'
import { BadRequest, Conflict, NotFound } from '../utils/errors'
import { sanitizeUser } from '../utils/sanitization'

export default class PostService {
  static async create(text: string, authorId: string) {
    const author = await UserModel.findById(authorId)
    if (!author) throw new NotFound('User not found')

    const post = await PostModel.create({ text, author: author.id })

    author.posts = [...author.posts, post.id]
    await author.save()

    return { ...post.toJSON(), author: sanitizeUser(author) }
  }

  static async getFeed(userId: string, offset: number, limit: number) {
    if (offset < 0 || limit < 0 || Number.isNaN(offset) || Number.isNaN(limit))
      throw new BadRequest('Must provide offset and limit in query string')

    const user = await UserModel.findById(userId)
    if (!user) throw new NotFound('User not found')

    const posts = await PostModel.find()
      .populate({ path: 'author', select: ['-password', '-sessions'] })
      .where('author')
      .in([...user.friends, user.id])
      .sort({
        createdAt: 'desc',
      })
      .skip(offset)
      .limit(limit)

    return posts
  }

  static async getTimeline(userId: string, offset: number, limit: number) {
    if (offset < 0 || limit < 0 || Number.isNaN(offset) || Number.isNaN(limit))
      throw new BadRequest('Must provide offset and limit in query string')

    const user = await UserModel.findById(userId)
    if (!user) throw new NotFound('User not found')

    const posts = await PostModel.find({ author: user.id })
      .populate({ path: 'author', select: ['-password', '-sessions'] })
      .sort({
        createdAt: 'desc',
      })
      .skip(offset)
      .limit(limit)

    return posts
  }

  static async like(postId: string, userId: string) {
    const post = await PostModel.findById(postId)
    const user = await UserModel.findById(userId)

    if (!post) throw new NotFound('Post not found')
    if (!user) throw new NotFound('User not found')

    const alreadyLiked = post.likes.find((id) => id.toString() === user.id)
    if (alreadyLiked) throw new Conflict('User already liked this post')

    post.likes.push(user.id)
    await post.save()
    return post
  }

  static async unlike(postId: string, userId: string) {
    const post = await PostModel.findById(postId)
    const user = await UserModel.findById(userId)

    if (!post) throw new NotFound('Post not found')
    if (!user) throw new NotFound('User not found')

    const alreadyLiked = post.likes.find((id) => id.toString() === user.id)
    if (!alreadyLiked) throw new Conflict('User has not liked this post')

    post.likes = post.likes.filter((id) => id.toString() !== user.id)
    await post.save()
    return post
  }
}
