const express = require('express');
const tourController = require('./../controllers/tourController');
const tourRoutes = express.Router();
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');
tourRoutes.use('/:tourId/reviews', reviewRouter);

tourRoutes.param('id', (req, res, next, val) => {
  console.log(val);
  next();
});
tourRoutes.route('/tour-stats').get(tourController.getTourStat);
tourRoutes
  .route('/tour-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.getMonthlyTours
  );
tourRoutes.route('/top-5').get(tourController.top5, tourController.getAllTours);
tourRoutes
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

tourRoutes
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);

tourRoutes
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.createTour
  );
tourRoutes
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour
  );

module.exports = tourRoutes;
