import { NextFunction,Request, Response } from 'express'
import { AnyZodObject } from 'zod'

import { BadRequest } from '../utils/errors'

const validateBody =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
    } catch (err) {
      throw new BadRequest(err.errors[0].message)
    }
    return next()
  }

export default validateBody
