import cookieParser from 'cookie-parser'
import express from 'express'

import errorHandler from './middlewares/errorHandler'
import validateToken from './middlewares/validateToken'
import commentRouter from './routes/comment.route'
import postRouter from './routes/post.route'
import userRouter from './routes/user.route'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(validateToken)

app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', commentRouter)

app.use(errorHandler)

export default app
