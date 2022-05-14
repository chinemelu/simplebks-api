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
    const { sellerId, sellerZipCodePrefix } = req.body
    if (isInputEmpty(sellerId)) {
      return ServerResponses.response(
        res,
        { message: 'Seller id is required' },
        STATUS_CODE.USER_ERROR
      )
    }
    if (!isString(sellerId)) {
      return ServerResponses.response(
        res,
        { message: 'Invalid Seller id' },
        STATUS_CODE.USER_ERROR
      )
    }
    if (isInputEmpty(sellerZipCodePrefix)) {
      return ServerResponses.response(
        res,
        { message: 'Seller zip code prefix is required' },
        STATUS_CODE.USER_ERROR
      )
    }
    if (!isPositiveInteger(sellerZipCodePrefix)) {
      return ServerResponses.response(
        res,
        { message: 'Invalid zip code prefix' },
        STATUS_CODE.USER_ERROR
      )
    }
    try {
      const seller = await SellerRepository.authenticateSeller({
        username: trimStringValues(sellerId), password: sellerZipCodePrefix
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
            username: sellerId, password: sellerZipCodePrefix
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
