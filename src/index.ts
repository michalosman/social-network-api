import http from 'http'
import app from './app'
import { connectDatabase } from './configs/database'
import { PORT } from './configs/secrets'

const server = http.createServer(app)

connectDatabase()

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
