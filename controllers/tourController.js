const fs = require('fs');
const tourModel = require('./../models/tourModel');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.getAllTours = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const exclude = ['page', 'sort', 'limit', 'fields'];
    exclude.forEach(ele => delete queryObject[ele]);
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, el => `$${el}`);

    let query = tourModel.find(JSON.parse(queryString));
    if (req.query.sort) {
      const sortStr = req.query.sort.split(',').join(' ');

      query = query.sort(sortStr);
    }
    if (req.query.fields) {
      const fieldStr = req.query.fields.split(',').join(' ');

      query = query.select(fieldStr);
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;

    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const tours = await query;
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
