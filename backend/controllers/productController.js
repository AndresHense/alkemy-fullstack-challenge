import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc Fetch all products
// @route GET /api/products
// @access public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc get order of user
// @route GET /api/orders/:id
// @access private
export const getMyProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Product.countDocuments({})
  const products = await Product.find({ user: req.user._id })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc Fetch single products
// @route GET /api/products/id
// @access public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('not found')
  }
})

// @desc update product
// @route PUT /api/products/:id
// @access private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { concept, amount, type, date } = req.body

  const product = await Product.findById(req.params.id)
  if (product) {
    product.concept = concept
    product.amount = amount
    product.date = date
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc create product
// @route POST /api/products/
// @access private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    concept: 'Sample concept',
    amount: 0,
    user: req.user._id,
    type: req.body.type.toUpperCase(),
    date: Date.now(),
  })
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc delete product
// @route DELTE /api/products/:id
// @access private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
