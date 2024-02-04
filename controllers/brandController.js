import Brand from '../model/Brand.js';
import asyncHandler from 'express-async-handler';

//@description  Create new Brand
//@route        POST /api/v1/category/createBrand
//@access       Private/Admin

export const createBrandCtrl = asyncHandler(async(req,res)=>{
    const imageConverter = req.file.path;
    const {name} = req.body
    
    const brandFound = await Brand.findOne({name})
    if(brandFound){
        throw new Error("Brand exist already");
    }
    const newBrand = await Brand.create({
        name: name,
        user: req.userAuthId,
        image: imageConverter,
    });

    res.json({
        status:"success",
        msg:"Brand created succesfully",
        newBrand,
    })
})

//@description  Get all brand
//@route        GET /api/v1/brand
//@access       Public

export const getAllBrandController = asyncHandler(async(req,res)=>{
    const brand = await Brand.find();
    res.json({
        status:"success",
        msg:"brand fetched succesfully",
        brand,
    })
})

//@description  Get brand
//@route        GET /api/v1/brand/:id
//@access       Public

export const getSingleBrandController = asyncHandler(async(req,res)=>{
    const brand = await Brand.findById(req.params.id);
    res.json({
        status:"success",
        msg:"Brand fetched succesfully",
        brand,
    })
})

// @description update a brand
// @route       PUT /api/brand/:id/updateBrand
// @access      Private/Admin

export const updateBrandController = asyncHandler(async(req, res)=>{
    const imageConverter = req.file.path;
    const {name} = req.body;

    //check if name exist
    const brandExists = await Brand.findOne({
        name,
    })

    //check if name exist
    const currentBrandExist = await Brand.findById(req.params.id)

    if(brandExists){
       
        if(brandExists?.name != currentBrandExist?.name){
            throw new Error("category already exist");}
    }

    //update
    const brand = await Brand.findByIdAndUpdate(req.params.id,{
            name,
            image: imageConverter,
    },{
        new: true,
    });

    res.json({
        status:"success",
        message: "brand updated",
        brand,
    });
})

// @description delete a brand
// @route       DELETE /api/brand/:id/deleteBrand
// @access      Private/Admin
export const deleteBrandController = asyncHandler(async(req, res)=>{
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message: "brand deleted",
    });
})
