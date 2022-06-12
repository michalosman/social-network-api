import mongoose from 'mongoose'
import { MONGO_URI } from './constants'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to DB')
  } catch (e) {
    console.log(e)
  }
}
