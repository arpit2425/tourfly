const express = require('express');
const app = express.Router();
const viewController = require('./../controllers/viewController');
app.get('/overview', viewController.overview);
app.get('/tour', viewController.tour);
module.exports = app;
