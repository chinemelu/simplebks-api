import envData from '../../configs/envData.js'

import { MongoClient } from 'mongodb'

export const client = new MongoClient(envData.MONGODB_URI)

export const startClient = async () => {
  try {
    await client.connect()
  } catch (err) {
    console.log(err)
  }
}
