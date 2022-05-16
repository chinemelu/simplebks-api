import Mongodb from 'mongodb'
import ServerResponses from '../utilities/ServerResponses.js'
import SellerRepository from '../repository/SellerRepository.js'
import OrderItemsRepository from '../repository/OrderItemsRepository.js'
import { convertToNumber } from '../helpers/utility.js'
import {
  RESPONSE_MESSAGE,
  STATUS_CODE,
  ORDER,
  SORT
} from '../utilities/constants.js'
import { isValidObjectId } from '../helpers/validationHelper.js'
import APIException from '../utilities/APIException.js'

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
      // if there is an order and the order is not asc or desc throw an error
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

  /**
   * @description describes the method for deleting a seller order item
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Call back function to pass on data to the next middleware
   * @returns {object} response object
   */

  static async deleteSellerOrderItem (req, res, next) {
    let orderItemId = req.params.id
    const sellerId = req.seller.seller_id
    if (!orderItemId) {
      throw new APIException(RESPONSE_MESSAGE.MISSING_ORDER_ITEM_ID)
    }
    if (orderItemId && !isValidObjectId(orderItemId)) {
      return ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.INVALID_ORDER_ITEM_ID },
        STATUS_CODE.USER_ERROR
      )
    }
    orderItemId = new Mongodb.ObjectId(orderItemId)

    try {
      const order = await OrderItemsRepository.findOrderItem({
        _id: orderItemId,
        seller_id: sellerId
      })
      // order will be an array of items
      if (!order.length) {
        return ServerResponses.response(
          res,
          { message: RESPONSE_MESSAGE.ORDER_ITEM_NOT_FOUND },
          STATUS_CODE.NOT_FOUND
        )
      }
      await OrderItemsRepository.deleteOrderItem({
        _id: orderItemId,
        seller_id: sellerId
      })
      ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.ORDER_ITEM_DELETED },
        STATUS_CODE.OK
      )
    } catch (err) {
      next(err)
    }
  }

  /**
   * @description describes the method for updating a seller's city or state
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Call back function to pass on data to the next middleware
   * @returns {object} response object
   */
  static async UpdateSellerCityState (req, res, next) {
    const sellerCityFromAuthHeader = req.seller.seller_city
    const sellerStateFromAuthHeader = req.seller.seller_state
    const sellerId = req.seller._id

    const sellerCityToUpdate = req.body.sellerCity
    const sellerStateToUpdate = req.body.sellerState

    let updateObject = {}
    // !! operator checks if the sellerCity or sellerState is specified in the request body
    const shouldSellerCityBeUpdated = !!sellerCityToUpdate && sellerCityFromAuthHeader !== sellerCityToUpdate
    const shouldSellerStateBeUpdated = !!sellerStateToUpdate && sellerStateFromAuthHeader !== sellerStateToUpdate
    // if city and state specified are different from that in the header
    if (shouldSellerCityBeUpdated && shouldSellerStateBeUpdated) {
      updateObject = {
        seller_city: sellerCityToUpdate,
        seller_state: sellerStateToUpdate
      }
    }

    // if state specified is different from that in the header
    if (shouldSellerCityBeUpdated && !shouldSellerStateBeUpdated) {
      updateObject = {
        seller_city: sellerCityToUpdate
      }
    }

    // if only state specified is different from that in the header
    if (!shouldSellerCityBeUpdated && shouldSellerStateBeUpdated) {
      updateObject = {
        seller_state: sellerStateToUpdate
      }
    }

    const updateResponse = {
      seller_city: sellerCityToUpdate,
      seller_state: sellerStateToUpdate
    }

    if (!shouldSellerCityBeUpdated && !shouldSellerStateBeUpdated) {
      return ServerResponses.response(
        res,
        {
          message: RESPONSE_MESSAGE.SUCCESSFUL_ACCOUNT_UPDATE,
          data: updateResponse
        },
        STATUS_CODE.OK
      )
    }

    try {
      await SellerRepository
        .updateAccount({ _id: sellerId },
          updateObject
        )
      return ServerResponses.response(
        res,
        { message: RESPONSE_MESSAGE.SUCCESSFUL_ACCOUNT_UPDATE, data: updateResponse },
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
