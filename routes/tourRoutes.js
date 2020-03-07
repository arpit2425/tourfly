const express = require('express');
const tourController = require('./../controllers/tourController');
const tourRoutes = express.Router();
tourRoutes.param('id', (req, res, next, val) => {
  console.log(val);
  next();
});
tourRoutes
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
tourRoutes
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
module.exports = tourRoutes;
