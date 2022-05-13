import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import envData from './configs/envData.js'

import v1Routes from './routes/index.js'

const app = express()

const corsOption = {
  credentials: true,
  methods: 'GET,PUT,PATCH,POST,DELETE'
}

app.use(cors(corsOption))
app.use(morgan('dev'))

app.use(express.json({
  limit: envData.MAX_FILE_SIZE
}))

app.use(express.urlencoded({
  extended: false
}))

app.use(v1Routes)

app.listen(envData.PORT, () => console.log(`App listening on port ${envData.PORT}`))
