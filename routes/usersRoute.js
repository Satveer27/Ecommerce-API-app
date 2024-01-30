import express from 'express';
import { getUserProfileController, loginUserController, registerUserController, updateShippingAddressController } from '../controllers/usersController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const userRoutes = express.Router();

userRoutes.post('/register', registerUserController);
userRoutes.post('/login', loginUserController);
userRoutes.get('/profile', isLoggedIn , getUserProfileController);
userRoutes.put('/updateShipping', isLoggedIn, updateShippingAddressController);

export default userRoutes;