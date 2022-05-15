import { Router } from 'express'
import ServerResponses from '../utilities/ServerResponses.js'
import AuthController from '../controllers/AuthController.js'
import authMiddleware from '../middleware/auth.js'
import SellerController from '../controllers/SellerController.js'

const router = Router()

router.get('/', (req, res) => ServerResponses.response(
  res, { message: 'welcome to Simplebks api' }
))

router.post('/auth/login', AuthController.login)
router.get('/order_items', authMiddleware, SellerController.fetchSellerOrderItems)
router.delete('/order_items/:id', authMiddleware, SellerController.deleteSellerOrderItem)
router.patch('/account', authMiddleware, SellerController.UpdateSellerCityState)

export default router
