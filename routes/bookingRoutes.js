const express = require('express');
const bookingRouter = express.Router();
const bookingController = require('./../controller/bookingController');
const authController = require('./../controller/authController');

bookingRouter.use(authController.protect);
bookingRouter.get(
  '/checkout-session/:tourId',
  bookingController.getCheckoutSession
);
bookingRouter.use(authController.restrictTo('admin', 'lead-guide'));
bookingRouter
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

bookingRouter
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = bookingRouter;
