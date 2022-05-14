import envData from '../../configs/envData.js'

import { MongoClient } from 'mongodb'

export const client = new MongoClient(envData.DATABASE_CONNECTION_STRING)

export const startClient = async (cb) => {
  try {
    await client.connect()
    const response = await cb()
    return response
  } catch (err) {
    console.log(err)
  }
}
