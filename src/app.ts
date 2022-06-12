import express from 'express'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/errorHandler'
import validateToken from './middlewares/validateToken'
import userRouter from './routes/user.route'
import 'express-async-errors'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(validateToken)

app.use('/api/users', userRouter)

app.use(errorHandler)

export default app
