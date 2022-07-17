import { NextFunction, Request, Response } from 'express'

import { HttpError } from '../utils/errors'

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof HttpError)
    return res.status(err.code).json({
      error: {
        code: err.code,
        message: err.message,
      },
    })

  console.log(err)

  return res.status(500).json({
    error: {
      code: 500,
      message: 'Something went wrong',
    },
  })
}

export default errorHandler
