import Color from '../model/Color.js';
import asyncHandler from 'express-async-handler';

//@description  Create new color
//@route        POST /api/v1/color/createColor
//@access       Private/Admin

export const createColorCtrl = asyncHandler(async(req,res)=>{

    const{name} = req.body
    const colorFound = await Color.findOne({name})
    if(colorFound){
        throw new Error("color exist already");
    }
    const newColor = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status:"success",
        msg:"Color created succesfully",
        newColor,
    })
})

//@description  Get all color
//@route        GET /api/v1/color
//@access       Public

export const getAllColorController = asyncHandler(async(req,res)=>{
    const color = await Color.find();
    res.json({
        status:"success",
        msg:"Color fetched succesfully",
        color,
    })
})

//@description  Get color
//@route        GET /api/v1/color/:id
//@access       Public

export const getSingleColorController = asyncHandler(async(req,res)=>{
    const color = await Color.findById(req.params.id);
    res.json({
        status:"success",
        msg:"Color fetched succesfully",
        color,
    })
})

// @description update a color
// @route       PUT /api/color/:id/updateColor
// @access      Private/Admin

export const updateColorController = asyncHandler(async(req, res)=>{
    const {name} = req.body;

    //check if name exist
    const colorExist = await Color.findOne({
        name,
    })

    if(colorExist){
        throw new Error("Color already exist");
    }

    //update
    const color = await Color.findByIdAndUpdate(req.params.id,{
            name,
    },{
        new: true,
    });

    res.json({
        status:"success",
        message: "color updated",
        color,
    });
})

// @description delete a color
// @route       DELETE /api/color/:id/deleteColor
// @access      Private/Admin
export const deleteColorController = asyncHandler(async(req, res)=>{
    const color = await Color.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message: "color deleted",
        color,
    });
})
