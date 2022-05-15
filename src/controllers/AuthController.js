import SellerRepository from '../repository/SellerRepository.js'
import ServerResponses from '../utilities/ServerResponses.js'
import { RESPONSE_MESSAGE, STATUS_CODE } from '../utilities/constants.js'
import { trimStringValues } from '../helpers/utility.js'
import credentialsToBase64Converter from '../helpers/base64converter.js'
import {
  isInputEmpty,
  isString,
  isPositiveInteger
} from '../helpers/validationHelper.js'

/**
 * @description describes auth controller
 *
 * @class AuthController
 */

class AuthController {
  /**
   * @description login into the application
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Call back function to pass on data to the next middleware
   * @returns {object} response object
   */
  static async login (req, res, next) {
    const { username, password } = req.body
    if (isInputEmpty(username)) {
      return ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.USERNAME_REQUIRED },
        STATUS_CODE.USER_ERROR
      )
    }
    if (!isString(username)) {
      return ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.INVALID_USERNAME },
        STATUS_CODE.USER_ERROR
      )
    }
    if (isInputEmpty(password)) {
      return ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.PASSWORD_REQUIRED },
        STATUS_CODE.USER_ERROR
      )
    }
    if (!isPositiveInteger(password)) {
      return ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.INVALID_PASSWORD },
        STATUS_CODE.USER_ERROR
      )
    }
    try {
      const seller = await SellerRepository.authenticateSeller({
        username: trimStringValues(username), password
      })

      if (!seller) {
        return ServerResponses.response(
          res, {
            message: RESPONSE_MESSAGE.INVALID_CREDENTIALS
          },
          STATUS_CODE.AUTH_ERROR
        )
      }
      ServerResponses.response(res,
        {
          userId: seller._id,
          credentials: credentialsToBase64Converter({
            username, password
          })
        },
        STATUS_CODE.OK
      )
    } catch (err) {
      ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.SERVER_ERROR },
        STATUS_CODE.SERVER_ERROR)
    }
  }
}

export default AuthController
