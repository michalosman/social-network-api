import { Router } from 'express'
import UserController from '../controllers/user.controller'

const userRouter = Router()

userRouter.post('/register', UserController.register)
userRouter.post('/login', UserController.login)
userRouter.get('/', UserController.getAll)
userRouter.get('/:id', UserController.get)
userRouter.patch('/:id/friend/request', UserController.requestFriend)
userRouter.patch('/:id/friend/accept', UserController.acceptFriend)
userRouter.patch('/:id/friend/reject', UserController.rejectFriend)
userRouter.patch('/:id/friend/remove', UserController.removeFriend)

export default userRouter
