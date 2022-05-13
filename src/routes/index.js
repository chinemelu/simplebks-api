import { Router } from 'express'
import ServerResponses from '../utilities/ServerResponses.js'
import AuthController from '../controllers/AuthController.js'

const router = Router()

router.get('/', (req, res) => ServerResponses.response(
  res, { message: 'welcome to Simplebks api' }
))

router.post('/auth', AuthController.login)

export default router
