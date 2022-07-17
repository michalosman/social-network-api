import { model,Schema, Types } from 'mongoose'

export interface IComment {
  text: string
  author: Types.ObjectId
  post: Types.ObjectId
}

const commentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const CommentModel = model<IComment>('Comment', commentSchema)

export default CommentModel
