import logger from './logger.js'
import APIException from './APIException.js'
import { ERROR, RESPONSE_MESSAGE } from './constants.js'
import ServerResponses from './ServerResponses.js'

/**
     * @description global exception handler
     * @param {object} err - err
     * @param {object} req - request body
     * @param {object} res - response body
     * @param {object} next - the error object
     * @returns {Error} - server response
     */
export const generalErrorHandler = (err, req, res, next) => {
  const {
    name
  } = err
  let { message, statusCode } = err
  switch (name) {
    case ERROR.VALIDATION_ERROR:
      statusCode = 400
      break

    case ERROR.NOT_FOUND:
      statusCode = 404
      break

    default:
    // server errors
      statusCode = 500
      message = RESPONSE_MESSAGE.SERVER_ERROR
  }
  logger.error(err)
  return ServerResponses.response(res, { Error: message }, statusCode)
}

/**
     * @description handle reoute not found
     * @param {object} req - request body
     * @param {object} res - response body
     * @param {object} next - the error object
     * @returns {Error} - object representing response response
     */
export const notFoundHander = (req, res, next) => {
  const err = new APIException(RESPONSE_MESSAGE.NOT_FOUND)
  err.status = 404
  next(err)
}
