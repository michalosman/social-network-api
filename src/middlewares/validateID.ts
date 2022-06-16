import { BadRequest } from './../utils/errors'
import { Types } from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import 'express-async-errors'

const validateID = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  if (!Types.ObjectId.isValid(id)) throw new BadRequest('Invalid ID')

  return next()
}

export default validateID
