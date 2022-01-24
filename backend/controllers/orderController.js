import asyncHandler from 'express-async-handler'
import mercadopago from 'mercadopago'
import Order from '../models/orderModel.js'
import generateToken from '../utils/generateToken.js'

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

    const updatedOrder = order.save()
    res.redirect(`/http://localhost:${process.env.PORT}/orders/${order.id}`)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})
