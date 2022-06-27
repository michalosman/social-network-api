import { Types, Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

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
  comparePassword: (candidatePassword: string) => Promise<boolean>
}

const userSchema = new Schema<IUser>({
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

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const UserModel = model<IUser>('User', userSchema)

export default UserModel
