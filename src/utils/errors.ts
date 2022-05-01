export abstract class HttpError extends Error {
  code: number
  message: string

  constructor(code: number, message: string) {
    super()
    this.code = code
    this.message = message
  }
}

export class BadRequest extends HttpError {
  constructor(message: string) {
    super(400, message)
  }
}

export class Unauthorized extends HttpError {
  constructor(message: string) {
    super(401, message)
  }
}

export class Forbidden extends HttpError {
  constructor(message: string) {
    super(403, message)
  }
}

export class NotFound extends HttpError {
  constructor(message: string) {
    super(404, message)
  }
}

export class MethodNotAllowed extends HttpError {
  constructor(message: string) {
    super(405, message)
  }
}

export class Conflict extends HttpError {
  constructor(message: string) {
    super(409, message)
  }
}
