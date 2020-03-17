const express = require('express');
const app = express.Router();
const viewController = require('./../controllers/viewController');
app.get('/', viewController.overview);
app.get('/tour', viewController.tour);
module.exports = app;
