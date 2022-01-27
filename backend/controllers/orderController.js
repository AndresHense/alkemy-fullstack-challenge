import asyncHandler from 'express-async-handler'
import mercadopago from 'mercadopago'
import Order from '../models/orderModel.js'
import generateToken from '../utils/generateToken.js'
import nodemailer from 'nodemailer'
import path from 'path'

// @desc create new order
// @route POST /api/orders
// @access private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    itemsPrice,
    taxPrice,
    totalPrice,
  } = req.body
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @desc get order by id
// @route GET /api/orders/:id
// @access private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )
  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export const payOrders = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  const itemsPreference = []
  order.orderItems.forEach((item) => {
    itemsPreference.push({
      title: item.name,
      unit_price: item.price,
      quantity: item.qty,
    })
  })

  let preference = {
    items: itemsPreference,
    back_urls: {
      success: `http://localhost:${process.env.PORT}/api/orders/${req.params.id}/updatepay`,
      failure: `http://localhost:${process.env.PORT}/api/orders/${req.params.id}/updatepay`,
      pending: `http://localhost:${process.env.PORT}/api/orders/${req.params.id}/updatepay`,
    },
    auto_return: 'approved',
  }
  try {
    const response = await mercadopago.preferences.create(preference)
    res.json(response.body.init_point)
  } catch (error) {
    res.status(404)
    console.error(error)
  }
})

// @desc update order to paid
// @route PUT /api/orders/:id
// @access private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order && req.query.status === 'approved') {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.query.payment_id,
      status: req.query.status,
      merchantOrder: req.query.merchant_order_id,
    }

    const updatedOrder = await order.save()

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'andreshense',
        pass: process.env.EMAIL_PASS,
      },
    })

    const __dirname = path.resolve()
    const filePath = path.join(__dirname, 'backend', 'data', 'Elena.pdf')
    let mailOptions = {
      from: 'andreshense@gmail.com',
      to: 'industriaspepetoa@hotmail.com',
      subject: 'test nodemailer',
      text: 'hey, watsup, im testing tis',
      attachments: [
        {
          filename: 'Elena.pdf',
          path: filePath,
        },
      ],
    }
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log('email sent!')
      }
    })
    if (process.env.NODE_ENV === 'development') {
      res.redirect(`http://localhost:3000/order/${req.params.id}`)
    } else {
      res.redirect(`/order/${req.params.id}`)
    }
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc get order of user
// @route GET /api/orders/:id
// @access private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc get all orders
// @route GET /api/orders/
// @access private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

// @desc deliver order
// @route PUT /api/orders/:id
// @access private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})
