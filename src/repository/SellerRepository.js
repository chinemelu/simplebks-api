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
   * @description find if a seller exists in the database
   * @param { object } sellerData - the query filter
   * @returns mapped data
  */

  static async authenticateSeller ({ username, password }) {
    try {
      await startClient()
      const response = await client.db(CONFIG.DB).collection(CONFIG.ORDER_SELLERS)
        .findOne({ seller_id: username, seller_zip_code_prefix: password })
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

  static async updateAccount (filterData, updateObject) {
    try {
      await startClient()
      const response = await client.db(CONFIG.DB).collection(CONFIG.ORDER_SELLERS)
        .updateOne(filterData, { $set: { ...updateObject } })
      return response
    } catch (err) {
      throw new APIException(RESPONSE_MESSAGE.SERVER_ERROR)
    }
  }
}

export default SellerRepository
