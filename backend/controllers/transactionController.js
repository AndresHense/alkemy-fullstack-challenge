import asyncHandler from 'express-async-handler'
import Transaction from '../models/transactionModel.js'

// @desc Fetch all transactions
// @route GET /api/transactions
// @access public
export const getTransactions = asyncHandler(async (req, res) => {
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

  const count = await Transaction.countDocuments({ ...keyword })
  const transactions = await Transaction.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ transactions, page, pages: Math.ceil(count / pageSize) })
})

// @desc get order of user
// @route GET /api/orders/:id
// @access private
export const getMyTransactions = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Transaction.countDocuments({})
  const transactions = await Transaction.find({ user: req.user._id })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ transactions, page, pages: Math.ceil(count / pageSize) })
})

// @desc Fetch single transactions
// @route GET /api/transactions/id
// @access public
export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
  if (transaction) {
    res.json(transaction)
  } else {
    res.status(404)
    throw new Error('not found')
  }
})

// @desc update transaction
// @route PUT /api/transactions/:id
// @access private/Admin
export const updateTransaction = asyncHandler(async (req, res) => {
  const { concept, amount, type, date } = req.body

  const transaction = await Transaction.findById(req.params.id)
  if (transaction) {
    transaction.concept = concept
    transaction.amount = amount
    transaction.date = date
    const updatedTransaction = await transaction.save()
    res.json(updatedTransaction)
  } else {
    res.status(404)
    throw new Error('Transaction not found')
  }
})

// @desc create transaction
// @route POST /api/transactions/
// @access private/Admin
export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.create({
    concept: 'Sample concept',
    amount: 0,
    user: req.user._id,
    type: req.body.type.toUpperCase(),
    date: Date.now(),
  })
  const createdTransaction = await transaction.save()
  res.status(201).json(createdTransaction)
})

// @desc delete transaction
// @route DELTE /api/transactions/:id
// @access private/Admin
export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
  if (transaction) {
    await transaction.remove()
    res.json({ message: 'Transaction removed' })
  } else {
    res.status(404)
    throw new Error('Transaction not found')
  }
})
