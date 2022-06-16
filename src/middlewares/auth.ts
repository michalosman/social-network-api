import { Request, Response, NextFunction } from 'express'
import { Unauthorized } from '../utils/errors'
import 'express-async-errors'

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) {
    throw new Unauthorized('User not authenticated')
  }
  return next()
}

export default auth
