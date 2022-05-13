/**
 * @description class for handling exceptions
 * @class APIException
 */
class APIException extends Error {
  /**
   * @description initialise instance of Error object
   * @param { string } message - error message
   * @param { number } statusCode - status code of error
   * @param { string } status - the type of exception
   * @param { string } name - the name of exception
   * @returns { Error } - object representing response error
   */
  constructor (message, statusCode, status = 'Error', name = 'validationError') {
    super()
    this.message = message
    this.statusCode = statusCode
    this.status = status
    this.name = name
    Error.captureStackTrace(this, APIException)
  }
}

export default APIException
