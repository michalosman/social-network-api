import { BadRequest } from './../utils/errors'
import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'

const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
    } catch (err) {
      throw new BadRequest(err.errors[0].message)
    }
    return next()
  }

export default validateSchema
