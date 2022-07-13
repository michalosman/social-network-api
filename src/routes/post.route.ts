import { Router } from 'express'
import PostController from '../controllers/post.controller'
import auth from '../middlewares/auth'
import validateID from '../middlewares/validateID'
import validateSchema from '../middlewares/validateSchema'
import { createPost } from '../schemas/post.schema'

const postRouter = Router()

postRouter.use(auth)

postRouter.post('/', validateSchema(createPost), PostController.create)
postRouter.patch('/:id/like', validateID, PostController.like)
postRouter.patch('/:id/unlike', validateID, PostController.unlike)

export default postRouter
