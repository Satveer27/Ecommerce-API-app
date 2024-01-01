import express from 'express';
import dbConnect from '../config/dbConnect.js';
import dotenv from 'dotenv';
import userRoutes from '../routes/usersRoute.js';
import { globalErrorHandler , notFound} from '../middlewares/globalErrorHandler.js';
import productRoutes from '../routes/productRoute.js';
import categoryRouter from '../routes/categoryRoute.js';
import brandRoute from '../routes/brandRoute.js';
import colorRouter from '../routes/colorRoute.js';
import reviewRoutes from '../routes/reviewRoute.js';
import orderRouter from '../routes/orderRouter.js';

//Have access to variable in env file
dotenv.config();

//Database connection
dbConnect();
const app = express();

//pass incoming data
app.use(express.json());

//routes
//mounting entire route inside app, according to pattern will redirect
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/category/', categoryRouter);
app.use('/api/v1/brand/', brandRoute);
app.use('/api/v1/color/', colorRouter);
app.use('/api/v1/reviews/', reviewRoutes);
app.use('/api/v1/order/', orderRouter);

//error middleware
app.use(notFound);
app.use(globalErrorHandler);

export default app;