const express = require('express');
const app = express.Router();
const viewController = require('./../controllers/viewController');
app.get('/', viewController.overview);
app.get('/tour/:slug', viewController.gettour);
app.get('/login', viewController.login);

module.exports = app;
