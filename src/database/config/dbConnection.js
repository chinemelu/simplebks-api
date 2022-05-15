import envData from '../../configs/envData.js'

import { MongoClient } from 'mongodb'

export const client = new MongoClient(envData.DATABASE_CONNECTION_STRING)

export const startClient = async () => {
  try {
    await client.connect()
  } catch (err) {
    console.log(err)
  }
}
