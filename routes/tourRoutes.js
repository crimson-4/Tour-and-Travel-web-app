const express = require('express');
const {
  getTours,
  aliasTopTours,
  getTour,
  postTour,
  patchTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  getTourWithin,
  getDistances,
} = require('./../controller/tourController');
const authController = require('./../controller/authController');
const tourRouter = express.Router();
const reviewRouter = require('./../routes/reviewRoutes');
//const reviewController = require('./../controller/reviewController');
//console.log(tourRouter);
//tourRouter.param('id', checkId);

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
  .route('/')
  .get(getTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    postTour
  );

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getTourWithin);

tourRouter.route('/distances/:latlng/unit/:unit').get(getDistances);

tourRouter.route('/top-5-cheap').get(aliasTopTours, getTours);

tourRouter.route('/tours-stats').get(getTourStats);
tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );

tourRouter
  .route('/:id')
  .get(authController.protect, getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    patchTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

// tourRouter
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

module.exports = tourRouter;
