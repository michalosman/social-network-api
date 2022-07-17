import 'express-async-errors'

import { NextFunction,Request, Response } from 'express'

import { Unauthorized } from '../utils/errors'

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) {
    throw new Unauthorized('User not authenticated')
  }
  return next()
}

export default auth
