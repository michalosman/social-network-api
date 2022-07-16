import { registerUserSchema, loginUserSchema } from './../schemas/user.schema'
import { Router } from 'express'
import UserController from '../controllers/user.controller'
import auth from '../middlewares/auth'
import validateParams from '../middlewares/validateParams'
import validateBody from '../middlewares/validateBody'

const userRouter = Router()

userRouter.post(
  '/register',
  validateBody(registerUserSchema),
  UserController.register
)
userRouter.post('/login', validateBody(loginUserSchema), UserController.login)
userRouter.post('/logout', auth, UserController.logout)
userRouter.post('/logout/all', auth, UserController.logoutAll)

userRouter.get('/', auth, UserController.getAll)
userRouter.get('/:id', auth, validateParams, UserController.get)

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
