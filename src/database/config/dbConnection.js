import envData from '../../configs/envData.js'

import { MongoClient } from 'mongodb'

async function listDatabases (client) {
  let databasesList = []
  databasesList = await client.db().admin().listDatabases()

  console.log('Databases:')
  databasesList.databases.forEach(db => console.log(` - ${db.name}`))
};

async function main () {
  const client = new MongoClient(envData.DATABASE_CONNECTION_STRING)

  try {
    await client.connect()
    await listDatabases(client)
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

main().catch(console.error)
