import { Router } from 'express'
import PostController from '../controllers/post.controller'
import auth from '../middlewares/auth'
import validateParams from '../middlewares/validateParams'
import validateBody from '../middlewares/validateBody'
import { createPost } from '../schemas/post.schema'

const postRouter = Router()

postRouter.use(auth)

postRouter.post('/', validateBody(createPost), PostController.create)
postRouter.patch('/:id/like', validateParams, PostController.like)
postRouter.patch('/:id/unlike', validateParams, PostController.unlike)

export default postRouter
