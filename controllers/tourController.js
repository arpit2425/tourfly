const tourModel = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
exports.top5 = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,duration,ratingsAverage,price';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(tourModel.find(), req.query)
    .filter()
    .sort()
    .limitfield()
    .paginate();
  const tours = await features.query;
  res.status(201).json({
    status: 'Success',
    result: tours.length,
    data: {
      tours
    }
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await tourModel.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new appError('No tour defined with this id'));
  }
  res.status(201).json({
    status: 'Success',

    data: {
      tour
    }
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new appError('No tour defined with this id'));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour
    }
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await tourModel.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new appError('No tour defined with this id'));
  }
  res.status(200).json({
    status: 'Success'
  });
});
exports.createTour = catchAsync(async (req, res, next) => {
  const newtour = await tourModel.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      newtour
    }
  });
});
exports.getMonthlyTours = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await tourModel.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $sort: { numTourStats: -1 }
    }
  ]);

  res.status(201).json({
    status: 'Success',
    data: {
      plan
    }
  });
});
exports.getTourStat = catchAsync(async (req, res, next) => {
  const stat = await tourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  res.status(201).json({
    status: 'Success',
    data: {
      stat
    }
  });
});
