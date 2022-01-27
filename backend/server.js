import express from 'express'
import connectDB from './config/db.js'
import path from 'path'
import dotenv from 'dotenv'
import colors from 'colors'
import ProductRouter from './routes/ProductRouter.js'
import userRouter from './routes/userRouter.js'
import orderRouter from './routes/orderRouter.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import morgan from 'morgan'
import mercadopago from 'mercadopago'
import cors from 'cors'
import pkg from 'cloudinary'

const cloudinary = pkg
const app = express()

app.use(express.json())
app.use(cors())
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

app.use('/api/products', ProductRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/upload', uploadRoutes)
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID)
})
connectDB()

mercadopago.configure({ access_token: process.env.ACCESS_TOKEN })

app.get('/feedback', function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  })
})
const __dirname = path.resolve()

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('app is running...')
  })
  app.use(morgan('dev'))
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
//`server runing in ${process.env.NODE_ENV} mode on port ${PORT}`
app.listen(PORT)
