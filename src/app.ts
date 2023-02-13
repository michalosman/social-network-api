import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import session from 'express-session'
import helmet from 'helmet'
import morgan from 'morgan'

import { CLIENT_URL, NODE_ENV, SESSION_SECRET } from './configs/constants'
import errorHandler from './middlewares/errorHandler'
import validateToken from './middlewares/validateToken'
import commentRouter from './routes/comment.route'
import postRouter from './routes/post.route'
import userRouter from './routes/user.route'

const app = express()

// Heroku deployment settings
app.set('trust proxy', 1)
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      secure: NODE_ENV === 'production',
    },
  })
)

app.use(helmet())
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

app.use('/health', (req: Request, res: Response) => res.json({ status: 'ok' }))

app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', commentRouter)

app.use(errorHandler)

export default app
