import dotenv from 'dotenv'
import connectDB from './config/db.js'
import colors from 'colors'
import mongoose from 'mongoose'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import bcrypt from 'bcryptjs'
import fs from 'fs'
dotenv.config()

connectDB()

const importData=async()=>{
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers=await User.insertMany(users)
        const adminUser=createdUsers[0]._id

        const sampleProdcuts=products.map(p=>{return {...p,user:adminUser}})
        sampleProdcuts[0].response=fs.readFileSync(process.cwd()+'/backend/data/Elena.pdf')

        await Product.insertMany(sampleProdcuts)

        console.log('data imported'.green.inverse)
        process.exit()

    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData=async()=>{
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

       
        console.log('data destroyed'.green.inverse)
        process.exit()

    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

if(process.argv[2]==='-d'){
    destroyData()
}else{
    importData()
}