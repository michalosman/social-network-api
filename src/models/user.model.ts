import { Types, Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser {
  firstName: string
  lastName: string
  email: string
  password: string
  image: string
  sessions: string[]
  friends: Types.ObjectId[]
  friendRequests: Types.ObjectId[]
  posts: Types.ObjectId[]
}

export interface UserDocument extends IUser {
  createdAt: Date
  updatedAt: Date
  comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  sessions: [
    {
      type: String,
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friendRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const hashedPassword = await bcrypt.hash(this.password, 10)
  this.password = hashedPassword

  return next()
})

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

const UserModel = model<UserDocument>('User', userSchema)

export default UserModel
