import { Types, Schema, model } from 'mongoose'

export interface IPost {
  text: string
  image: string
  author: Types.ObjectId
  likes: Types.ObjectId[]
  comments: Types.ObjectId[]
}

const postSchema = new Schema<IPost>(
  {
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const PostModel = model<IPost>('Post', postSchema)

export default PostModel
