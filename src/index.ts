import http from 'http'
import app from './app'
import { connectDatabase } from './config/database'
import { PORT } from './config/secrets'

const server = http.createServer(app)

connectDatabase()

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
