import express from 'express'
import {
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from '../controllers/productController.js'
import { admin, protect } from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/').get(protect, getMyProducts).post(protect, createProduct)
router.route('/admin').get(protect, admin, getProducts)
router
  .route('/:id')
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct)

export default router
