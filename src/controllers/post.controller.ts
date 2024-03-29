import { Request, Response } from 'express'

import PostService from '../services/post.service'

export default class PostController {
  static async create(req: Request, res: Response) {
    const { id: authorId } = res.locals.user
    const { text, image } = req.body

    const post = await PostService.create(text, image, authorId)

    res.json(post)
  }

  static async getFeed(req: Request, res: Response) {
    const { id: userId } = res.locals.user
    const { offset, limit } = req.query

    const posts = await PostService.getFeed(
      userId,
      parseInt(offset as string),
      parseInt(limit as string)
    )

    res.json(posts)
  }

  static async getTimeline(req: Request, res: Response) {
    const { userId } = req.params
    const { offset, limit } = req.query

    const posts = await PostService.getTimeline(
      userId,
      parseInt(offset as string),
      parseInt(limit as string)
    )

    res.json(posts)
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
