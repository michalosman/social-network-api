import PostService from '../services/post.service'
import { Request, Response } from 'express'

export default class PostController {
  static async create(req: Request, res: Response) {
    const { id: authorId } = res.locals.user
    const { text } = req.body

    const post = await PostService.create(text, authorId)
    res.json(post)
  }

  static async like(req: Request, res: Response) {
    const { id: userId } = res.locals.user
    const { id: postId } = req.params

    const post = await PostService.like(postId, userId)
    res.json(post)
  }

  static async unlike(req: Request, res: Response) {
    const { id: userId } = res.locals.user
    const { id: postId } = req.params

    const post = await PostService.unlike(postId, userId)
    res.json(post)
  }
}
