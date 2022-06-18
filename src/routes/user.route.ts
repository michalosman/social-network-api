import { registerUserSchema, loginUserSchema } from './../schemas/user.schema'
import { Router } from 'express'
import UserController from '../controllers/user.controller'
import auth from '../middlewares/auth'
import validateID from '../middlewares/validateID'
import validateSchema from '../middlewares/validateSchema'

const userRouter = Router()

userRouter.post(
  '/register',
  validateSchema(registerUserSchema),
  UserController.register
)
userRouter.post('/login', validateSchema(loginUserSchema), UserController.login)
userRouter.post('/logout', auth, UserController.logout)
userRouter.post('/logout/all', auth, UserController.logoutAll)

userRouter.get('/', auth, UserController.getAll)
userRouter.get('/:id', auth, validateID, UserController.get)

userRouter.patch(
  '/:id/friend/request',
  auth,
  validateID,
  UserController.requestFriend
)
userRouter.patch(
  '/:id/friend/accept',
  auth,
  validateID,
  UserController.acceptFriend
)
userRouter.patch(
  '/:id/friend/reject',
  auth,
  validateID,
  UserController.rejectFriend
)
userRouter.patch(
  '/:id/friend/remove',
  auth,
  validateID,
  UserController.removeFriend
)

export default userRouter
