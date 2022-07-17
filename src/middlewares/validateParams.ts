import 'express-async-errors'

import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'

import { BadRequest } from '../utils/errors'

const validateParams = (req: Request, res: Response, next: NextFunction) => {
  const { id, userId, postId, commentId } = req.params

  if (id && !Types.ObjectId.isValid(id)) throw new BadRequest('Invalid ID')

  if (userId && !Types.ObjectId.isValid(userId))
    throw new BadRequest('Invalid User ID')

  if (postId && !Types.ObjectId.isValid(postId))
    throw new BadRequest('Invalid Post ID')

  if (commentId && !Types.ObjectId.isValid(commentId))
    throw new BadRequest('Invalid Comment ID')

  return next()
}

export default validateParams
