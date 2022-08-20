import { Router } from 'express'

import CommentController from '../controllers/comment.controller'
import auth from '../middlewares/auth'
import validateBody from '../middlewares/validateBody'
import validateParams from '../middlewares/validateParams'
import commentSchema from '../schemas/comment.schema'

const commentRouter = Router()

commentRouter.use(auth)

commentRouter.post(
  '/:postId',
  validateParams,
  validateBody(commentSchema),
  CommentController.create
)

commentRouter.get('/:postId', validateParams, CommentController.get)

export default commentRouter
