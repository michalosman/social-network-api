import express from 'express'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/errorHandler'
import validateToken from './middlewares/validateToken'
import userRouter from './routes/user.route'
import postRouter from './routes/post.route'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(validateToken)

app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)

app.use(errorHandler)

export default app
