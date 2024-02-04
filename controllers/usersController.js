//Controller are where all business logic are stored
import asyncHandler from 'express-async-handler';
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import generateToken from '../utils/generateToken.js';

// @description Register users
// @route Post /api/v1/users/register
// @access Private/Admin
// Only developer of application can register as admin

export const registerUserController = asyncHandler(async(req, res)=>{
    const{username, email, password} = req.body;
    //Check if user exist
    const userExists = await User.findOne({ email});
    if(userExists){
        throw new Error('User already exists');
    }
    else{
        //Hash password
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create user
        const user = await User.create({
            username, 
            email, 
            password: hashedPassword,
        });
        res.status(201).json({
            status: 'success',
            msg: 'User registered succesfully',
            data: user,
         })
    }
    
});

// @description Login users
// @route Post /api/v1/users/Login
// @access Public

export const loginUserController = asyncHandler(async(req, res)=>{
    const {email,password} = req.body;
    
    //Find user in db by email only
    const userFound = await User.findOne({email});

    if(userFound && await bcrypt.compare(password, userFound?.password)){
        res.json({
            status:'success',
            msg:'Success login',
            userFound:{
                username: userFound?.username,
                isAdmin: userFound?.isAdmin, 
            },
            token: generateToken(userFound.id)
        });
    }
    else{
        throw new Error('Invalid login credentials');
    }
    
});

// @description GET user profile
// @route GET /api/v1/users/profile
// @access Private
export const getUserProfileController = asyncHandler(async(req,res)=>{{
    //find user
    const user = await User.findById(req.userAuthId).populate("orders");
    res.json({
        status: "success",
        message:"user profile",
        user,
    })
}
});

// @description Update shipping address
// @route       PUT /api/v1/users/updateShipping
// @access      Private
export const updateShippingAddressController = asyncHandler(async(req,res)=>{
    const {firstName, lastName, address, city, postalCode, country, phone} = req.body;
    const user = await User.findByIdAndUpdate(req.userAuthId,{
        shippingAddress:{
            firstName, 
            lastName, 
            address, 
            city, 
            postalCode, 
            country, 
            phone
        },
        hasShippingAddress: true,
    },{
        new:true,
    });
    //send response
    res.json({
        status:"success",
        message:"User shipping added succesfully",
        user,
    })
})
