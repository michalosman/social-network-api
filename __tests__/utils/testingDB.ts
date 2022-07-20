import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoTestServer: MongoMemoryServer

export const connectTestingDB = async () => {
  mongoTestServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoTestServer.getUri())

  mongoose.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, converted) => {
      // eslint-disable-next-line no-param-reassign, no-underscore-dangle
      delete converted._id
    },
  })
}

export const disconnectTestingDB = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  await mongoTestServer.stop()
}
