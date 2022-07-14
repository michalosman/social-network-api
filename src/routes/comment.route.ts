import { createComment } from './../schemas/comment.schema'
import { Router } from 'express'
import CommentController from '../controllers/comment.controller'
import auth from '../middlewares/auth'
import validateSchema from '../middlewares/validateSchema'

const commentRouter = Router()

commentRouter.use(auth)

commentRouter.post('/', validateSchema(createComment), CommentController.create)

export default commentRouter
