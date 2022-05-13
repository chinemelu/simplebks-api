import dotenv from 'dotenv'

dotenv.config()

const envData = {
  PORT: process.env.port || 9000,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
  DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING
}

export default envData
