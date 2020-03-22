const express = require('express');
const app = express.Router();
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');
app.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.overview
);
app.get('/tour/:slug', authController.isLoggedIn, viewController.gettour);
app.get('/login', authController.isLoggedIn, viewController.login);
app.get('/signup', authController.isLoggedIn, viewController.signup);
app.get('/me', authController.protect, viewController.getAccount);
app.get('/my-tours', authController.protect, viewController.getMyTours);
app.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = app;
