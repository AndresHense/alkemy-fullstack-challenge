import express from 'express'
import connectDB from './config/db.js'
import path from 'path'
import dotenv from 'dotenv'
import colors from 'colors'
import transactionRouter from './routes/transactionRouter.js'
import userRouter from './routes/userRouter.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())
dotenv.config()

app.use('/api/transactions', transactionRouter)
app.use('/api/users', userRouter)

connectDB()

const __dirname = path.resolve()

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
