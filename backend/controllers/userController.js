import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js';

// @desc auth user & get token
// @route POST /api/users/login
// @access public
export const authUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            email:user.email,
            name:user.name,
            isAdmin:user.isAdmin,
            token:null
        })
    }else{
        res.send(401)
        throw new Error("email or password invalid")
    }
    res.json(products);
})
