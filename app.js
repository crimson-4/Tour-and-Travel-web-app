const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const express = require('express');
const AppError = require('./utils/appError');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const hpp = require('hpp');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const cors = require('cors');

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global middlewares
app.use(cors());
app.options('*', cors());

//Set Securi ty http headers
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "script-src-elem 'self' https://js.stripe.com/v3/",
//     //"script-src-elem 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js",

//     "img-src 'self'"
//   );

//   next();
// });

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

console.log(process.env.NODE_ENV);
// Limit requests from same ip
const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: 'Too many request from this IP ,please try again in an hour!',
});

app.use('/api', limiter);

//Body Parser ,reading data from  body into req.boyd
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(cookieParser());
// Data sanitization against No sql quert injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent paramter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
app.use((req, res, next) => {
  // console.log(req.headers);
  //console.log(req.cookies);
  next();
});

// Routes

// app.get('/api/v1/tours', getTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', postTour);
// app.patch('/api/v1/tours/:id', patchTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// Router
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
//console.log('hi');
app.all('*', (req, res, next) => {
  //   const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  //   err.status = 'fail';
  //   err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
