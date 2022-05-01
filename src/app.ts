import express from 'express'
import errorHandler from './middlewares/errorHandler'
import userRouter from './routes/user.route'

const app = express()

app.use(express.json())

app.use('/api/users', userRouter)

app.use(errorHandler)

export default app
