const express = require('express');
const tourController = require('./../controllers/tourController');
const tourRoutes = express.Router();
const authController = require('./../controllers/authController');
tourRoutes.param('id', (req, res, next, val) => {
  console.log(val);
  next();
});
tourRoutes.route('/tour-stats').get(tourController.getTourStat);
tourRoutes.route('/tour-plan/:year').get(tourController.getMonthlyTours);
tourRoutes.route('/top-5').get(tourController.top5, tourController.getAllTours);
tourRoutes
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
tourRoutes
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour
  );
module.exports = tourRoutes;
