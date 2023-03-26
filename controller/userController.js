const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFeilds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFeilds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.postUser = (req, res) => {
  //console.log('some update action performed');
  res.status(500).json({
    status: 'success',
    data: 'This route is not defined|Please use /signup instead',
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //Create error if user Posts password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates.Please use /updateMyPassword'
      )
    );
  //filtered out not allowed  fields name
  const filteredBody = filterObj(req.body, 'name', 'email');
  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  //user.name = 'Amarjeet test';
  // await user.save();
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  //Create error if user Posts password data
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});
exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//Do not update the passwords with this
exports.patchUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
