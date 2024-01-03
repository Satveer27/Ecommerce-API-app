import Order from "../model/Order.js";
import asyncHandler from 'express-async-handler';
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import dotenv from "dotenv";


//@desc   create orders
//@route  POST /api/v1/order/createOrder
//@access private
dotenv.config();

//Stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);


export const createOrderController = asyncHandler(async(req,res)=>{ 
    //Get the payload(things we need for the order-customer, orderitems, shipping address, total price)
    const {orderItems, shippingAddress, totalPrice} = req.body;
    
    //Find the user
    const user = await User.findById(req.userAuthId);

    //check if user has shipping address
    if(!user?.hasShippingAddress){
        throw new Error("No shipping adress found, please add one");
    }

    //check if order is not empty
    if (orderItems.length<=0){
        throw new Error("No order items found");
    };

    //Place the order - save to db
    const order = await Order.create({
        user: req.userAuthId,
        orderItems,
        shippingAddress,
        totalPrice,
    })
    
    //push order into user
    user.orders.push(order?._id);
    await user.save();

    //update product quantity
    const products = await Product.find({_id:{$in:orderItems}}) 
    
    orderItems?.map(async (order)=>{
        const product = products?.find((product)=>{
            return product?._id.toString() === order?._id.toString();
        })
        if(product){
            product.totalSold += order.totalQtyBuying;
        }
        await product.save();
    })

    //make payment(stripe)
    //convert order items to have same structure as stripe need
    const convertedOrders = orderItems.map((item)=>{
        return{
            price_data:{
                currency:'usd',
                product_data:{
                    name: item?.name,
                    description: item?.description,
                },
                unit_amount:item?.price * 100,
            },
            quantity: item?.totalQtyBuying,
        }
    })
    const session = await stripe.checkout.sessions.create({
        //order user pay for
        line_items: convertedOrders,
        metadata:{
            orderId: JSON.stringify(order?._id),
        }, 
        mode: "payment",
        success_url:"https://www.youtube.com/",
        cancel_url:"https://www.youtube.com/",
    });
    res.send({url: session.url })
    //Payment webhook


    //Update user order
    
});

//@desc   get all orders
//@route  GET /api/v1/order/allOrder
//@access private/Admin

export const getAllOrderController = asyncHandler(async(req,res)=>{
//find all orders
const order = await Order.find();
res.json({
    success:true,
    message: "All order",
    order,
})
})

//@desc   get single order
//@route  GET /api/v1/order/:id
//@access private/Admin

export const getSingleOrderController = asyncHandler(async(req,res)=>{
    //get Single order
    const id =  req.params.id;
    const order = await Order.findById(id);
    res.json({
        success:true,
        message: "single order",
        order,
    })
})