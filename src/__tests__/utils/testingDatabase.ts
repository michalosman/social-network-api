import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoTestServer: MongoMemoryServer

export const connectTestingDatabase = async () => {
  mongoTestServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoTestServer.getUri())
}

export const disconnectTestingDatabase = async () => {
  await mongoTestServer.stop()
  await mongoose.disconnect()
}
