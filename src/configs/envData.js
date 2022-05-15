import dotenv from 'dotenv'

dotenv.config()

const envData = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
  MONGODB_URI: process.env.MONGODB_URI
}

export default envData
