import APIException from '../utilities/APIException.js'
import { startClient, client } from '../database/config/dbConnection.js'
import { CONFIG, ORDER, RESPONSE_MESSAGE } from '../utilities/constants.js'

/**
 * @description class will implement order items database query
 *
 * @class OrderItemsRepository
 */
class OrderItemsRepository {
  /**
   * @description find data across multiple documents
   * @param { object } filterData - the query filter
   * @returns database data
   */

  static async findOrderItems (filterData, { limit, offset, sort, order }) {
    try {
      const responseCb = () => {
        const pipeline = [
          {
            $lookup: {
              from: 'orderProducts',
              localField: 'product_id',
              foreignField: 'product_id',
              as: 'product_info'
            }
          },
          { $unwind: '$product_info' }, // converts the product_info into an object, from an array
          { $match: filterData },
          { $sort: { [sort]: order === ORDER.ASC ? 1 : -1 } },
          { $skip: offset },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              id: '$order_item_id',
              product_id: '$product_info.product_id',
              product_category: '$product_info.product_category_name',
              price: '$price',
              date: '$shipping_limit_date'
            }
          }
        ]
        return client.db(CONFIG.DB)
          .collection(CONFIG.ORDER_ITEMS)
          .aggregate(pipeline).toArray()
      }
      const response = await startClient(responseCb)
      return response
    } catch (err) {
      throw new APIException(RESPONSE_MESSAGE.SERVER_ERROR)
    }
  }

  /**
   * @description count number of order items
   * @returns db data
   */

  static async findItemsCount () {
    try {
      const responseCb = () => {
        return client.db(CONFIG.DB).collection(CONFIG.ORDER_ITEMS)
          .countDocuments()
      }
      const response = await startClient(responseCb)
      return response
    } catch (err) {
      throw new APIException(RESPONSE_MESSAGE.SERVER_ERROR)
    }
  }

  /**
   * @description look for item in database
   * @param {object} filterData
   * @returns db data
   */

  static async findOrder (filterData) {
    try {
      const responseCb = () => {
        return client.db(CONFIG.DB).collection(CONFIG.ORDER_ITEMS)
          .find(filterData).toArray()
      }
      const response = await startClient(responseCb)
      return response
    } catch (err) {
      throw new APIException(RESPONSE_MESSAGE.SERVER_ERROR)
    }
  }

  /**
   * @description delete order item in database
   * @param {object} filterData
   * @returns db data
   */
  static async deleteOrder (filterData) {
    try {
      const responseCb = () => {
        return client.db(CONFIG.DB).collection(CONFIG.ORDER_ITEMS)
          .deleteMany(filterData)
      }
      const response = await startClient(responseCb)
      return response
    } catch (err) {
      throw new APIException(RESPONSE_MESSAGE.SERVER_ERROR)
    }
  }
}

export default OrderItemsRepository
