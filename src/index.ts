import http from 'http'
import app from './app'
import { PORT } from './config/secrets'

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
