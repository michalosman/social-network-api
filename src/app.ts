import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { CLIENT_URL } from './configs/constants'
import errorHandler from './middlewares/errorHandler'
import validateToken from './middlewares/validateToken'
import commentRouter from './routes/comment.route'
import postRouter from './routes/post.route'
import userRouter from './routes/user.route'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(validateToken)
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
)

app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', commentRouter)

app.use(errorHandler)

export default app
