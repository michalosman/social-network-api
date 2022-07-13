import { Conflict } from './../utils/errors'
import PostModel from '../models/post.model'
import UserModel from '../models/user.model'
import { NotFound } from '../utils/errors'
import 'express-async-errors'

export default class PostService {
  static async create(text: string, authorId: string) {
    const author = await UserModel.findById(authorId)
    if (!author) throw new NotFound('User not found')

    const newPost = await PostModel.create({ text, author: author._id })
    return newPost
  }

  static async like(postId: string, userId: string) {
    const post = await PostModel.findById(postId)
    const user = await UserModel.findById(userId)

    if (!post) throw new NotFound('Post not found')
    if (!user) throw new NotFound('User not found')

    const alreadyLiked = post.likes.find((id) => id.equals(user._id))
    if (alreadyLiked) throw new Conflict('User already liked this post')

    post.likes.push(user._id)
    await post.save()
    return post
  }

  static async unlike(postId: string, userId: string) {
    const post = await PostModel.findById(postId)
    const user = await UserModel.findById(userId)

    if (!post) throw new NotFound('Post not found')
    if (!user) throw new NotFound('User not found')

    const alreadyLiked = post.likes.find((id) => id.equals(user._id))
    if (!alreadyLiked) throw new Conflict('User has not liked this post')

    post.likes = post.likes.filter((id) => !id.equals(user._id))
    await post.save()
    return post
  }
}
