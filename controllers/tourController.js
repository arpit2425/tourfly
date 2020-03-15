// const tourModel = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const appError = require('./../utils/appError');
// exports.top5 = (req, res, next) => {
//   req.query.limit = 5;
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,duration,ratingsAverage,price';
//   next();
// };

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(tourModel.find(), req.query)
//     .filter()
//     .sort()
//     .limitfield()
//     .paginate();
//   const tours = await features.query;
//   res.status(201).json({
//     status: 'Success',
//     result: tours.length,
//     data: {
//       tours
//     }
//   });
// });
// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await tourModel.findById(req.params.id).populate('reviews');
//   if (!tour) {
//     return next(new appError('No tour defined with this id'));
//   }
//   res.status(201).json({
//     status: 'Success',

//     data: {
//       tour
//     }
//   });
// });
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });
//   if (!tour) {
//     return next(new appError('No tour defined with this id'));
//   }
//   res.status(200).json({
//     status: 'Success',
//     data: {
//       tour
//     }
//   });
// });
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await tourModel.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new appError('No tour defined with this id'));
//   }
//   res.status(200).json({
//     status: 'Success'
//   });
// });
// exports.createTour = catchAsync(async (req, res, next) => {
//   const newtour = await tourModel.create(req.body);
//   res.status(201).json({
//     status: 'Success',
//     data: {
//       newtour
//     }
//   });
// });
// exports.getMonthlyTours = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1;
//   const plan = await tourModel.aggregate([
//     {
//       $unwind: '$startDates'
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`)
//         }
//       }
//     },
//     {
//       $group: {
//         _id: { $month: '$startDates' },
//         numTourStats: { $sum: 1 },
//         tours: { $push: '$name' }
//       }
//     },
//     {
//       $addFields: { month: '$_id' }
//     },
//     {
//       $sort: { numTourStats: -1 }
//     }
//   ]);

//   res.status(201).json({
//     status: 'Success',
//     data: {
//       plan
//     }
//   });
// });
// exports.getTourStat = catchAsync(async (req, res, next) => {
//   const stat = await tourModel.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } }
//     },
//     {
//       $group: {
//         _id: '$difficulty',
//         avgRating: { $avg: '$ratingsAverage' },
//         avgPrice: { $avg: '$price' },
//         minPrice: { $min: '$price' },
//         maxPrice: { $max: '$price' }
//       }
//     },
//     {
//       $sort: { avgPrice: 1 }
//     }
//   ]);
//   res.status(201).json({
//     status: 'Success',
//     data: {
//       stat
//     }
//   });
// });
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.top5 = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStat = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyTours = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
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
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
