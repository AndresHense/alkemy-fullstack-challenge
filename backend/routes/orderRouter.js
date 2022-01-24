import express from 'express'
import {
  addOrderItems,
  getOrderById,
  payOrders,
  updateOrderToPaid,
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/').post(protect, addOrderItems)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').post(protect, payOrders)
router.route('/:id/updatepay').get(updateOrderToPaid)

export default router
