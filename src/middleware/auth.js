import SellerRepository from '../repository/SellerRepository.js'
import ServerResponses from '../utilities/ServerResponses.js'
import { RESPONSE_MESSAGE, STATUS_CODE } from '../utilities/constants.js'
import { isValidBase64, arePlainTextCredentialsTheRightPattern } from '../helpers/validationHelper.js'

const authMiddleware = async (req, res, next) => {
  // if authorization header is missing
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic')) {
    return ServerResponses.response(
      res,
      { message: RESPONSE_MESSAGE.MISSING_AUTHORIZATION_HEADER },
      STATUS_CODE.AUTH_ERROR
    )
  }

  try {
    // verify Base64 encoded credentials
    const encodedCredentials = req.headers.authorization.split(' ')[1]

    // check if encoded credentials are valid base64
    if (!isValidBase64) {
      return ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.INVALID_CREDENTIALS },
        STATUS_CODE.AUTH_ERROR
      )
    }
    const credentialsInPlainText = Buffer.from(encodedCredentials, 'base64').toString('ascii')

    // check the validity of credentials in plain text; they should match username:password pattern

    if (!arePlainTextCredentialsTheRightPattern(credentialsInPlainText)) {
      return ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.INVALID_CREDENTIALS },
        STATUS_CODE.AUTH_ERROR
      )
    }
    let [username, password] = credentialsInPlainText.split(':')
    password = Number(password)
    const seller = await SellerRepository.authenticateSeller({ username, password })

    if (seller) {
      req.seller = seller
      return next()
    }
    ServerResponses.response(
      res,
      { message: RESPONSE_MESSAGE.INVALID_CREDENTIALS },
      STATUS_CODE.AUTH_ERROR
    )
  } catch (err) {
    return ServerResponses.response(
      res,
      { message: RESPONSE_MESSAGE.SERVER_ERROR },
      STATUS_CODE.SERVER_ERROR
    )
  }
}

export default authMiddleware
