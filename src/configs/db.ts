/* eslint-disable no-console */
import mongoose from 'mongoose'

import { MONGO_URI } from './constants'

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)

    mongoose.set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: (doc, converted) => {
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        delete converted._id
      },
    })

    console.log('Connected to DB')
  } catch (error) {
    console.log(error)
  }
}

export default connectDB
