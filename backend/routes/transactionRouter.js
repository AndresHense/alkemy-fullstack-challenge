import express from 'express'
import {
  getMyTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
} from '../controllers/transactionController.js'
import { admin, protect } from '../middleware/authMiddleware.js'
const router = express.Router()

router
  .route('/')
  .get(protect, getMyTransactions)
  .post(protect, createTransaction)
router.route('/admin').get(protect, admin, getTransactions)
router
  .route('/:id')
  .get(getTransactionById)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction)

export default router
