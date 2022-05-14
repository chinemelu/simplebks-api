import APIException from '../utilities/APIException.js'
import { startClient, client } from '../database/config/dbConnection.js'
import { CONFIG, RESPONSE_MESSAGE } from '../utilities/constants.js'

/**
 * @description class will implement seller database query
 *
 * @class SellerRepository
 */
class SellerRepository {
  /**
   * @description fetch user data
   * @param { object } filterData - the query filter
   * @returns mapped data
   */
  static async findOne (filterData) {
    try {
      await startClient()
      const response = await client.db(CONFIG.DB).collection(CONFIG.ORDER_SELLERS)
        .findOne(filterData)
      await client.close()
      return response
    } catch (err) {
      throw new APIException(RESPONSE_MESSAGE.SERVER_ERROR)
    }
  }
  /**
   * @description find if a seller exists in the database
   * @param { object } sellerData - the query filter
   * @returns mapped data
  */

  static async authenticateSeller ({ username, password }) {
    try {
      const responseCb = () => {
        return client.db(CONFIG.DB).collection(CONFIG.ORDER_SELLERS)
          .findOne({ seller_id: username, seller_zip_code_prefix: password })
      }
      const response = await startClient(responseCb)
      return response
    } catch (err) {
      throw new APIException(RESPONSE_MESSAGE.SERVER_ERROR)
    }
  }

  /**
   * @description delete seller data
   * @param { object } filterData - the query filter
   * @param { object } options - the optional options object
   * @returns mapped data
   */

  static async deleteOne (filterData, options = null) {
    try {
      const response = await client.db(CONFIG.DB).collection(CONFIG.ORDER_SELLERS)
        .deleteOne(filterData, options)
      return response
    } catch (err) {
      throw new APIException(RESPONSE_MESSAGE.SERVER_ERROR)
    }
  }

  /**
   * @description update seller data
   * @param { object } filterData - the query filter
   * @param { object } update - the update operations to be applied to the document
   * @returns mapped data
   */

  static async updateOne (filterData, update) {
    try {
      const response = await client.orderSellers.updateOne(filterData, update)
      return response
    } catch (err) {
      throw new APIException(RESPONSE_MESSAGE.SERVER_ERROR)
    }
  }
}

export default SellerRepository
