import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createOrderController, getAllOrderController, getSingleOrderController, updateOrderController } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/createOrder', isLoggedIn, createOrderController);
orderRouter.get('/allOrder', isLoggedIn, getAllOrderController);
orderRouter.get('/:id', isLoggedIn, getSingleOrderController);
orderRouter.put('/update/:id', isLoggedIn, updateOrderController);

export default orderRouter;