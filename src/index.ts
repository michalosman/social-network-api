/* eslint-disable no-console */
import http from 'http'

import app from './app'
import { PORT } from './configs/constants'
import connectDB from './configs/db'

const server = http.createServer(app)

connectDB()

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
