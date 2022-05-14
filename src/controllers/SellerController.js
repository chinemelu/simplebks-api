import ServerResponses from '../utilities/ServerResponses.js'
// import SellerRepository from '../repository/SellerRepository.js'
import OrderItemsRepository from '../repository/OrderItemsRepository.js'
import { convertToNumber } from '../helpers/utility.js'
import {
  RESPONSE_MESSAGE,
  STATUS_CODE,
  ORDER,
  SORT
} from '../utilities/constants.js'

/**
 * @description describes Seller controller
 *
 * @class SellerController
 */

class SellerController {
  /**
   * @description describes the method for fetching seller order items
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Call back function to pass on data to the next middleware
   * @returns {object} response object
   */
  static async fetchSellerOrderItems (req, res, next) {
    try {
      let { offset, limit, sort, order } = req.query
      // convert string to number
      if (!limit) {
        limit = 20
      }
      if (limit < 20 || limit > 100) {
        return ServerResponses.response(
          res,
          { message: RESPONSE_MESSAGE.INVALID_QUERY_LIMIT },
          STATUS_CODE.USER_ERROR
        )
      }

      if (!offset) {
        offset = 0
      }

      if (!order) {
        order = ORDER.ASC
      }

      if (order && (order !== ORDER.ASC && order !== ORDER.DESC)) {
        return ServerResponses.response(
          res,
          { message: RESPONSE_MESSAGE.INVALID_ORDER_QUERY_STRING },
          STATUS_CODE.USER_ERROR
        )
      }

      if (!sort) {
        sort = SORT.SHIPPING_LIMIT_DATE
      }

      if (sort && (sort !== SORT.SHIPPING_LIMIT_DATE && sort !== SORT.PRICE)) {
        return ServerResponses.response(
          res,
          { message: RESPONSE_MESSAGE.INVALID_SORT_QUERY_STRING },
          STATUS_CODE.USER_ERROR
        )
      }
      // convert these from string to number
      limit = convertToNumber(limit)
      offset = convertToNumber(offset)

      const total = await OrderItemsRepository.findItemsCount()
      const sellerId = req.seller.seller_id
      const orderItems = await OrderItemsRepository.findOrderItems({
        seller_id: sellerId
      }, { limit, offset, sort, order })
      ServerResponses.response(res,
        {
          data: orderItems,
          total,
          limit,
          offset
        },
        STATUS_CODE.OK
      )
    } catch (err) {
      ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.SERVER_ERROR },
        STATUS_CODE.SERVER_ERROR
      )
    }
  }
}

export default SellerController
