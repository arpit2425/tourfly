const express = require('express');
const userRoutes = express.Router();
const multer = require('multer');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const upload = multer({ dest: 'public/img/users' });
userRoutes.route('/signup').post(authController.signup);
userRoutes.post('/login', authController.login);
userRoutes.get('/logout', authController.logout);
userRoutes.post('/forgetPassword', authController.forgetPassword);
userRoutes.patch('/resetPassword/:token', authController.resetPassword);
userRoutes.use(authController.protect);
userRoutes.patch(
  '/updatePassword',

  authController.updatePassword
);
userRoutes.patch('/updateMe', upload.single('photo'), userController.updateMe);
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
