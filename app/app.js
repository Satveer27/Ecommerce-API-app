import express from 'express';
import dbConnect from '../config/dbConnect.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from '../routes/usersRoute.js';
import { globalErrorHandler , notFound} from '../middlewares/globalErrorHandler.js';
import productRoutes from '../routes/productRoute.js';
import categoryRouter from '../routes/categoryRoute.js';
import brandRoute from '../routes/brandRoute.js';
import colorRouter from '../routes/colorRoute.js';
import reviewRoutes from '../routes/reviewRoute.js';
import orderRouter from '../routes/orderRouter.js';
import Order from '../model/Order.js';
import couponRouter from '../routes/couponRoute.js';
import path from 'path';

//Have access to variable in env file
dotenv.config();

//Database connection
dbConnect();
const app = express();

//cors
app.use(cors());

//stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

//parse data
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
  }
});


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_CLI_SECRET;

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type === "checkout.session.completed"){
    
    //update order
    const session = event.data.object;
    console.log(session);
    console.log('hello world');
    const {orderId} = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;

    //find the order
    const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
      totalPrice: totalAmount/100,
      currency,
      paymentMethod,
      paymentStatus
    }, {
      new:true,
    });

    console.log(order);
    console.log(paymentStatus);
  }
  else{
    console.log(event.type)
    return;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

//server static files
app.use(express.static('public'))
//routes
//Home route
app.get('/',(req,res)=>{
  res.sendFile(path.join('public','index.html'))
})
//mounting entire route inside app, according to pattern will redirect
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/category/', categoryRouter);
app.use('/api/v1/brand/', brandRoute);
app.use('/api/v1/color/', colorRouter);
app.use('/api/v1/reviews/', reviewRoutes);
app.use('/api/v1/order/', orderRouter);
app.use('/api/v1/coupon/', couponRouter);

//error middleware
app.use(notFound);
app.use(globalErrorHandler);

export default app;