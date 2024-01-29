import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCouponController, deleteCouponsController, getAllCouponsController, getSingleCouponsController, updateCouponsController } from '../controllers/couponController.js';
import isAdmin from '../middlewares/isAdmin.js';

const couponRouter = express.Router();

couponRouter.post('/createCoupon', isLoggedIn, isAdmin, createCouponController);
couponRouter.get('/allCoupon', getAllCouponsController);
couponRouter.get('/single', getSingleCouponsController);
couponRouter.delete('/:id/deleteCoupon', isLoggedIn, isAdmin, deleteCouponsController);
couponRouter.put('/:id/updateCoupon', isLoggedIn, isAdmin, updateCouponsController);

export default couponRouter;