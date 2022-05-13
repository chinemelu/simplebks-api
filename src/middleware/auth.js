import SellerRepository from '../repository/SellerRepository.js'
import ServerResponses from '../utilities/ServerResponses.js'
import { RESPONSE_MESSAGE, STATUS_CODE } from '../utilities/constants.js'

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
    const encodedCredentials = req.headers.authorization.split(' ')[0]
    const credentialsInPlainText = Buffer.from(encodedCredentials, 'base64').toString('ascii')
    const [username, password] = credentialsInPlainText.split(':')
    const seller = SellerRepository.authenticateSeller({ username, password })

    if (seller) {
      req.seller = seller
      return next()
    }
    return ServerResponses.response(
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
