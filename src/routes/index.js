import { Router } from 'express'
import ServerResponses from '../utilities/ServerResponses.js'
import AuthController from '../controllers/AuthController.js'
import authMiddleware from '../middleware/auth.js'
import SellerController from '../controllers/SellerController.js'

const router = Router()

router.get('/', (req, res) => ServerResponses.response(
  res, { message: 'welcome to Simplebks api' }
))

router.post('/auth', AuthController.login)
router.get('/order_items', authMiddleware, SellerController.fetchSellerOrderItems)

export default router
