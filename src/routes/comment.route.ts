import { createComment } from './../schemas/comment.schema'
import { Router } from 'express'
import CommentController from '../controllers/comment.controller'
import auth from '../middlewares/auth'
import validateBody from '../middlewares/validateBody'
import validateParams from '../middlewares/validateParams'

const commentRouter = Router()

commentRouter.use(auth)

commentRouter.post(
  '/:postId',
  validateParams,
  validateBody(createComment),
  CommentController.create
)

export default commentRouter
