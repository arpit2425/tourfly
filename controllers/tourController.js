const tourModel = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
exports.top5 = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,duration,ratingsAverage,price';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: 'Fail'
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await tourModel.findById(req.params.id);
    res.status(201).json({
      status: 'Success',

      data: {
        tour
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'Fail'
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'Success',
      data: {
        tour
      }
    });
  } catch (err) {
    console.log(err);
  }
};
exports.deleteTour = async (req, res) => {
  try {
    const tour = await tourModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'Success'
    });
  } catch (err) {
    console.log(err);
  }
};
exports.createTour = async (req, res) => {
  try {
    const newtour = await tourModel.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        newtour
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'Fail'
    });
  }
};
exports.getMonthlyTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: 'Fail',
      error: {
        err
      }
    });
  }
};
exports.getTourStat = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: 'Fail',
      error: {
        err
      }
    });
  }
};
