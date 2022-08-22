/* eslint-disable func-names */
import bcrypt from 'bcrypt'
import { model, Schema, Types } from 'mongoose'

export interface IUser {
  firstName: string
  lastName: string
  email: string
  password: string
  image: string
  friends: Types.ObjectId[]
  friendRequests: Types.ObjectId[]
  posts: Types.ObjectId[]
  sessions: string[]
}

interface IUserDocument extends IUser {
  comparePassword: (candidatePassword: string) => Promise<boolean>
}

const userSchema = new Schema<IUserDocument>({
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
  sessions: [
    {
      type: String,
    },
  ],
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const hashedPassword = await bcrypt.hash(this.password, 10)
  this.password = hashedPassword

  return next()
})

userSchema.pre('findOneAndUpdate', async function (next) {
  const data = this.getUpdate()
  if (!data) return next()

  // @ts-ignore
  if (!data.password) return next()
  // @ts-ignore
  const hashedPassword = await bcrypt.hash(data.password, 10)
  // @ts-ignore
  data.password = hashedPassword

  return next()
})

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password)
}

const UserModel = model<IUserDocument>('User', userSchema)

export default UserModel
