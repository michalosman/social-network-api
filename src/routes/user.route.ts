import { Router } from 'express'

import UserController from '../controllers/user.controller'
import auth from '../middlewares/auth'
import validateBody from '../middlewares/validateBody'
import validateParams from '../middlewares/validateParams'
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from '../schemas/user.schema'

const userRouter = Router()

userRouter.post(
  '/register',
  validateBody(registerUserSchema),
  UserController.register
)
userRouter.post('/login', validateBody(loginUserSchema), UserController.login)
userRouter.post('/logout', auth, UserController.logout)
userRouter.post('/logout/all', auth, UserController.logoutAll)

userRouter.get('/search', auth, UserController.getSearched)
userRouter.get('/', auth, UserController.getCurrentUser)
userRouter.get('/:id', auth, validateParams, UserController.getUser)

userRouter.patch(
  '/',
  auth,
  validateBody(updateUserSchema),
  UserController.update
)
userRouter.patch(
  '/:id/friend/request',
  auth,
  validateParams,
  UserController.requestFriend
)
userRouter.patch(
  '/:id/friend/accept',
  auth,
  validateParams,
  UserController.acceptFriend
)
userRouter.patch(
  '/:id/friend/reject',
  auth,
  validateParams,
  UserController.rejectFriend
)
userRouter.patch(
  '/:id/friend/remove',
  auth,
  validateParams,
  UserController.removeFriend
)

export default userRouter
