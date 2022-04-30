import { Types, Schema, model } from 'mongoose'

export interface IComment {
  text: string
  author: Types.ObjectId
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
  },
  {
    timestamps: true,
  }
)

const CommentModel = model<IComment>('Comment', commentSchema)

export default CommentModel
