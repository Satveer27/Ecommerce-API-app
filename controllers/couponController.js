import asyncHandler from 'express-async-handler';
import Coupon from '../model/Coupon.js';

//@description  Create new Coupon
//@route        POST /api/v1/coupon/createCoupon
//@access       Private/Admin

export const createCouponController = asyncHandler(async(req,res)=>{
    const {code, startDate, endDate, discount} = req.body;

    const couponExist = await Coupon.findOne({
        code: code?.toUpperCase(),
    })

    if(couponExist){
        throw new Error("Coupon already exist");
    }

    if(isNaN(discount)){
        throw new Error("Discount value must be a number")
    }

    const createCoupon = await Coupon.create({
        code: code?.toUpperCase(),
        startDate,
        endDate,
        discount,
        user: req.userAuthId
    });

    res.json({
        status:"success",
        message:"created coupon",
        createCoupon
    })
})

//@description  get all Coupon
//@route        GET /api/v1/coupon/allCoupon
//@access       Private/Admin

export const getAllCouponsController = asyncHandler(async(req,res)=>{ 
    const coupons = await Coupon.find();
    res.json({
        status:"success",
        message:"all coupons",
        coupons,
    })
})

//@description  get single Coupon
//@route        GET /api/v1/coupon/:id
//@access       Private/Admin

export const getSingleCouponsController = asyncHandler(async(req,res)=>{ 
    const coupons = await Coupon.findOne({code: req.query.code});

    //check if it isnt found
    if (coupons === null){
        throw new Error("Coupon not found")
    }
    //check if expired
    if(coupons.isExpired){
        throw new Error("coupon is expired")
    }

    res.json({
        status:"success",
        message:"single coupons",
        coupons,
    })
})

//@description  delete a Coupon
//@route        GET /api/v1/coupon/:id/delete
//@access       Private/Admin

export const deleteCouponsController = asyncHandler(async(req,res)=>{ 
    const coupons = await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message:"deleted coupons",
        coupons,
    })
})

//@description  update a Coupon
//@route        GET /api/v1/coupon/:id/update
//@access       Private/Admin

export const updateCouponsController = asyncHandler(async(req,res)=>{ 
    const {code, startDate, endDate, discount} = req.body;

    //check if name exist
    const couponExist = await Coupon.findOne({
        code: code?.toUpperCase(),
    })

    const currentCouponExist = await Coupon.findById(req.params.id)
  
    if(couponExist){
       
        if(couponExist?.code != currentCouponExist?.code){
            throw new Error("Product already exist");}
    }
    
    const coupons = await Coupon.findByIdAndUpdate(req.params.id, {
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate
    },{
        new:true,
    });
    res.json({
        status:"success",
        message:"update coupons",
        coupons,
    })
})
