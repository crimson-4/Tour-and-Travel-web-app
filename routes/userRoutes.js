const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);
//console.log('hi', authController.signup);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
//Protect all routes after this middleware
userRouter.use(authController.protect);
userRouter.patch(
  '/updateMyPassword',

  authController.updatePassword
);
userRouter.patch('/updateMe', userController.updateMe);

userRouter.delete('/deleteMe', userController.deleteMe);

userRouter.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
userRouter.use(authController.restrictTo('admin'));
userRouter
  .route('/')
  .get(userController.getUsers)
  .post(userController.postUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
