import request from 'supertest'
import { startClient, client } from '../../src/database/config/dbConnection.js'
import { CONFIG, RESPONSE_MESSAGE } from '../../src/utilities/constants.js'

import app from '../../src/app.js'

beforeAll(async () => {
  await startClient()
  Promise.all([
    client.db(CONFIG.DB)
      .collection(CONFIG.ORDER_SELLERS)
      .insertOne({
        seller_id: 'c240c4061717ac1806ae6ee72be3533b',
        seller_zip_code_prefix: 20920,
        seller_city: 'Kafanchan',
        seller_state: 'Kaduna'
      }), client.db(CONFIG.DB)
      .collection(CONFIG.ORDER_PRODUCTS)
      .insertOne({
        product_id: 'ac6c3623068f30de03045865e4e10089',
        product_category_name: 'airdos',
        product_name_lenght: 27,
        product_description_lenght: 261,
        product_photos_qty: 1,
        product_weight_g: 371,
        product_length_cm: 26,
        product_height_cm: 4,
        product_width_cm: 26
      }),
    client.db(CONFIG.DB)
      .collection(CONFIG.ORDER_ITEMS)
      .insertOne({
        order_id: '00042b26cf59d7ce69dfabb4e55b4fd9',
        order_item_id: 1,
        product_id: 'ac6c3623068f30de03045865e4e10089',
        seller_id: 'df560393f3a51e74553ab94004ba5c87',
        shipping_limit_date: '2017-02-13 13:57:51',
        price: 199.0,
        freight_value: 18.14
      })
  ])
})

afterAll(async () => {
  Promise.all([
    client.db(CONFIG.DB).collection(CONFIG.ORDER_SELLERS)
      .deleteOne({
        seller_id: 'c240c4061717ac1806ae6ee72be3533b'
      }),
    client.db(CONFIG.DB).collection(CONFIG.ORDER_PRODUCTS)
      .deleteOne({
        product_id: 'ac6c3623068f30de03045865e4e10089'
      }),
    client.db(CONFIG.DB).collection(CONFIG.ORDER_ITEMS)
      .deleteOne({
        order_id: '00042b26cf59d7ce69dfabb4e55b4fd9'
      }),
    client.close()
  ])
})

describe('seller document', () => {
  test(
    'should throw an error is there is no basic authorization header',
    () => request(app)
      .get('/order_items')
      .set('Accept', 'application/json')
      .expect(401)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.MISSING_AUTHORIZATION_HEADER)
      })
  )
  test(
    'should throw an error when there is an invalid non base64 authorization header',
    () => request(app)
      .get('/order_items')
      .set('Authorization', 'Basic ' + '1234445535555')
      .set('Accept', 'application/json')
      .expect(401)

      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_CREDENTIALS)
      })
  )
  test(
    'should throw an error when there is an valid base64 authorization header string but wrong authentcation details',
    () => request(app)
      .get('/order_items')
      .set('Authorization', 'Basic ' + Buffer.from('c240c4061717ac1806ae6ee72be3533b:password').toString('base64'))
      .set('Accept', 'application/json')
      .expect(401)

      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_CREDENTIALS)
      })
  )
  test(
    'should throw an error when there is an valid base64 authorization header string but wrong pattern',
    () => request(app)
      .get('/order_items')
      .set('Authorization', 'Basic ' + Buffer.from('c240c4061717ac1806ae6ee72be3533b20920').toString('base64'))
      .set('Accept', 'application/json')
      .expect(401)

      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_CREDENTIALS)
      })
  )
  test(
    'should throw an error when there is an valid base64 authorization header string but wrong pattern',
    () => request(app)
      .get('/order_items')
      .set('Authorization', 'Basic ' + Buffer.from('c240c4061717ac1806ae6ee72be3533b20920').toString('base64'))
      .set('Accept', 'application/json')
      .expect(401)

      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_CREDENTIALS)
      })
  )
})
describe('Pagination parameters', () => {
  test(
    'should throw an error when there is a sort parameter lower than 20',
    () => request(app)
      .get('/order_items?limit=10')
      .set('Authorization', 'Basic ' + Buffer.from('c240c4061717ac1806ae6ee72be3533b:20920')
        .toString('base64'))
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_QUERY_LIMIT)
      })
  )
  test(
    'should throw an error when there is a sort parameter higher than 100',
    () => request(app)
      .get('/order_items?limit=101')
      .set('Authorization', 'Basic ' + Buffer.from('c240c4061717ac1806ae6ee72be3533b:20920')
        .toString('base64'))
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_QUERY_LIMIT)
      })
  )
  test(
    'should throw an error when there is a order parameter other than asc or desc',
    () => request(app)
      .get('/order_items?order=asce')
      .set('Authorization', 'Basic ' + Buffer.from('c240c4061717ac1806ae6ee72be3533b:20920')
        .toString('base64'))
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_ORDER_QUERY_STRING)
      })
  )
  test(
    'should throw an error when there is a sort parameter other than price or shipping_limit_date',
    () => request(app)
      .get('/order_items?sort=notprice')
      .set('Authorization', 'Basic ' + Buffer.from('c240c4061717ac1806ae6ee72be3533b:20920')
        .toString('base64'))
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_SORT_QUERY_STRING)
      })
  )
})

// describe('Invalid login credentials', () => {
//   test(
//     'should throw an error if username is incorrect',
//     () => request(app)
//       .post('/auth/login')
//       .send(authMock.LOGIN_INCORRECT_USERNAME)
//       .set('Accept', 'application/json')
//       .expect(401)
//       .then((res) => {
//         expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
//           message: expect.any(String)
//         }))
//         expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_CREDENTIALS)
//       })
//   )
//   test(
//     'should throw an error if password does not exist',
//     () => request(app)
//       .post('/auth/login')
//       .send(authMock.LOGIN_INCORRECT_PASSWORD)
//       .set('Accept', 'application/json')
//       .expect(401)
//       .then((res) => {
//         expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
//           message: expect.any(String)
//         }))
//         expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_CREDENTIALS)
//       })
//   )
// })
