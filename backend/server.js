import express from 'express';
import products from './data/products.js';
import connectDB from './config/db.js'
import dotenv from 'dotenv';
import colors from 'colors'
import ProductRouter from './routes/ProductRouter.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app=express();

app.use(express.json())
dotenv.config();
app.use("/api/products",ProductRouter)
connectDB()

app.use(notFound)
app.use(errorHandler)


const PORT=process.env.PORT || 5000;
//`server runing in ${process.env.NODE_ENV} mode on port ${PORT}`
app.listen(PORT);
