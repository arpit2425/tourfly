const express = require('express');
const userRoutes = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
userRoutes.route('/signup').post(authController.signup);
userRoutes.post('/login', authController.login);
userRoutes.post('/forgetPassword', authController.forgetPassword);
userRoutes.patch('/resetPassword/:token', authController.resetPassword);
userRoutes.use(authController.protect);
userRoutes.patch(
  '/updatePassword',

  authController.updatePassword
);
userRoutes.patch('/updateMe', userController.updateMe);
userRoutes.delete('/deleteMe', userController.deleteMe);
userRoutes.get(
  '/me',

  userController.getMe,
  userController.getUser
);
userRoutes.use(authController.restrictTo('admin'));
userRoutes
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRoutes
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = userRoutes;
