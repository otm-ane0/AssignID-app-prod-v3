export default class HttpError extends Error {
  status: string
  code: number
  httpError: boolean = true
  isOperational: boolean
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    this.code = statusCode
    // Error.captureStackTrace(this, this.constructor);
  }
}
