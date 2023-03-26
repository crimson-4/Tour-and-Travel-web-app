const Tour = require('../models/tourModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour Data from collection
  const tours = await Tour.find();
  //2) Build Template
  //3) Render the template using tour data
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Get the Dat, for the requested tour(including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review,rating,user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // Build the Template

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log(req.body.name, req.body.email);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  //console.log(updatedUser.email);
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
