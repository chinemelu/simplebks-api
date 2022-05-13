import { Router } from 'express'
import ServerResponses from '../utilities/ServerResponses.js'

const router = Router()

router.get('/', (req, res) => ServerResponses.response(
  res, { message: 'welcome to Simplebks api' }
))

export default router
