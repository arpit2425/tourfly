const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
exports.overview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});
exports.tour = (req, res) => {
  res.status(200).render('tour', {
    title: 'Tour'
  });
};
