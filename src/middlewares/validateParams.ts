import { BadRequest } from '../utils/errors'
import { Types } from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import 'express-async-errors'

const validateParams = (req: Request, res: Response, next: NextFunction) => {
  const { id, postId } = req.params

  if (id && !Types.ObjectId.isValid(id)) throw new BadRequest('Invalid ID')

  if (postId && !Types.ObjectId.isValid(postId))
    throw new BadRequest('Invalid post ID')

  return next()
}

export default validateParams
