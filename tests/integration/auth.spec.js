import request from 'supertest'
import { startClient, client } from '../../src/database/config/dbConnection.js'
import { CONFIG, RESPONSE_MESSAGE } from '../../src/utilities/constants.js'

import authMock from '../mock/auth.js'

import app from '../../src/app.js'

beforeAll(async () => {
  await startClient()
  await client.db(CONFIG.DB)
    .collection(CONFIG.ORDER_SELLERS)
    .insertOne({
      seller_id: 'c240c4061717ac1806ae6ee72be3533b',
      seller_zip_code_prefix: 20920,
      seller_city: 'Kafanchan',
      seller_state: 'Kaduna'
    })
})

afterAll(async () => {
  await client.db(CONFIG.DB).collection(CONFIG.ORDER_SELLERS)
    .deleteOne({
      seller_id: 'c240c4061717ac1806ae6ee72be3533b'
    })
  await client.close()
})

describe('User login with valid data', () => {
  test(
    'should login a new user when there are no errors',
    () => request(app)
      .post('/auth/login')
      .send(authMock.USER_VALID_DATA)
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          userId: expect.any(String),
          credentials: expect.any(String)
        }))
      })
  )
})
describe('User login attempt with invalid data', () => {
  test(
    'should throw an error when there is no username',
    () => request(app)
      .post('/auth/login')
      .send(authMock.LOGIN_NO_USERNAME)
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.USERNAME_REQUIRED)
      })
  )
  test(
    'should throw an error when there is no password',
    () => request(app)
      .post('/auth/login')
      .send(authMock.LOGIN_NO_PASSWORD)
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.PASSWORD_REQUIRED)
      })
  )
  test(
    'should throw an error when there is an invalid password',
    () => request(app)
      .post('/auth/login')
      .send(authMock.LOGIN_INVALID_PASSWORD)
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_PASSWORD)
      })
  )
  test(
    'should throw an error when there is an invalid username',
    () => request(app)
      .post('/auth/login')
      .send(authMock.LOGIN_INVALID_USERNAME)
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
          message: expect.any(String)
        }))
        expect(JSON.parse(res.text).message).toEqual(RESPONSE_MESSAGE.INVALID_USERNAME)
      })
  )
})

describe('Invalid login credentials', () => {
  test(
    'should throw an error if username is incorrect',
    () => request(app)
      .post('/auth/login')
      .send(authMock.LOGIN_INCORRECT_USERNAME)
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
    'should throw an error if password does not exist',
    () => request(app)
      .post('/auth/login')
      .send(authMock.LOGIN_INCORRECT_PASSWORD)
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
