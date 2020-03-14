const express = require('express');
const userRoutes = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
userRoutes.route('/signup').post(authController.signup);
userRoutes.post('/login', authController.login);
userRoutes.post('/forgetPassword', authController.forgetPassword);
userRoutes.patch('/resetPassword/:token', authController.resetPassword);
userRoutes.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
userRoutes.patch('/updateMe', authController.protect, userController.updateMe);
userRoutes.delete('/deleteMe', authController.protect, userController.deleteMe);
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
