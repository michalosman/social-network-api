import { Router } from 'express'

import PostController from '../controllers/post.controller'
import auth from '../middlewares/auth'
import validateBody from '../middlewares/validateBody'
import validateParams from '../middlewares/validateParams'
import { createPostSchema } from '../schemas/post.schema'

const postRouter = Router()

postRouter.use(auth)

postRouter.post('/', validateBody(createPostSchema), PostController.create)

postRouter.get('/feed', PostController.getFeed)
postRouter.get('/timeline/:userId', validateParams, PostController.getTimeline)
postRouter.get('/:id/comments', validateParams, PostController.getComments)

postRouter.patch('/:id/like', validateParams, PostController.like)
postRouter.patch('/:id/unlike', validateParams, PostController.unlike)

export default postRouter
