/* eslint-disable no-console */
// import mongoose from 'mongoose'
import http from 'http'

import app from './app'
import { NODE_ENV, PORT } from './configs/constants'
import connectDB from './configs/db'
import populateDB from './utils/populateDB'

const server = http.createServer(app)

connectDB()

if (NODE_ENV === 'development') {
  // mongoose.connection.dropDatabase()
  populateDB()
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
