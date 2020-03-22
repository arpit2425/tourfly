const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const appError = require('./../utils/appError');
exports.overview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.gettour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!tour) {
    return next(new appError('There is no tour with this name', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});
exports.login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
});
exports.signup = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account'
  });
});

exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Your Profile'
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
