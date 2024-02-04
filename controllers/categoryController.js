import Category from "../model/Category.js";
import asyncHandler from 'express-async-handler';

//@description  Create new category
//@route        POST /api/v1/category/createCategory
//@access       Private/Admin

export const createCategoryCtrl = asyncHandler(async(req,res)=>{
    const imageConverter = req.file.path;
    const{name} = req.body
    //check if category exist
    const categoryFound = await Category.findOne({name})
    if(categoryFound){
        throw new Error("Category exist already");
    }
    const newCategory = await Category.create({
        name: name,
        user: req.userAuthId,
        image: imageConverter,
    });

    res.json({
        status:"success",
        msg:"Category created succesfully",
        newCategory,
    })
})

//@description  Get all category
//@route        GET /api/v1/categories
//@access       Public

export const getAllCategoryController = asyncHandler(async(req,res)=>{
    const categories = await Category.find();
    res.json({
        status:"success",
        msg:"Category fetched succesfully",
        categories,
    })
})

//@description  Get category
//@route        GET /api/v1/categories/:id
//@access       Public

export const getSingleCategoryController = asyncHandler(async(req,res)=>{
    const categories = await Category.findById(req.params.id);
    res.json({
        status:"success",
        msg:"Category fetched succesfully",
        categories,
    })
})

// @description update a category
// @route       PUT /api/category/:id/updateCategory
// @access      Private/Admin

export const updateCategoryController = asyncHandler(async(req, res)=>{
    const imageConverter = req.file.path;
    const {name} = req.body;

    //check if name exist
    
    //check if name exist
    const categoryExist = await Category.findOne({
        name,
    })

    const currentCategoryExist = await Category.findById(req.params.id)
  
    if(categoryExist){
       
        if(categoryExist?.name != currentCategoryExist?.name){
            throw new Error("category already exist");}
    }
    

    //update
    const category = await Category.findByIdAndUpdate(req.params.id,{
            name,
            image: imageConverter,
    },{
        new: true,
    });

    res.json({
        status:"success",
        message: "category updated",
        category,
    });
})

// @description delete a category
// @route       DELETE /api/category/:id/deleteCategory
// @access      Private/Admin
export const deleteCategoryController = asyncHandler(async(req, res)=>{
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message: "category deleted",
        category,
    });
})
