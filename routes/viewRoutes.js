const express = require('express');
const app = express.Router();
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
app.use(authController.isLoggedIn);
app.get('/', viewController.overview);
app.get('/tour/:slug', viewController.gettour);
app.get('/login', viewController.login);

module.exports = app;
