import { Router } from 'express'

import CommentController from '../controllers/comment.controller'
import auth from '../middlewares/auth'
import validateBody from '../middlewares/validateBody'
import validateParams from '../middlewares/validateParams'
import { createCommentSchema } from './../schemas/comment.schema'

const commentRouter = Router()

commentRouter.use(auth)

commentRouter.post(
  '/:postId',
  validateParams,
  validateBody(createCommentSchema),
  CommentController.create
)

export default commentRouter
