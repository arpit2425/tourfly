const express = require('express');
const app = express.Router();
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

app.get('/', authController.isLoggedIn, viewController.overview);
app.get('/tour/:slug', authController.isLoggedIn, viewController.gettour);
app.get('/login', authController.isLoggedIn, viewController.login);
app.get('/me', authController.protect, viewController.getAccount);
app.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = app;
