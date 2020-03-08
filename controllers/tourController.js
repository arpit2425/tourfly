const fs = require('fs');
const tourModel = require('./../models/tourModel');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.getAllTours = async (req, res) => {
  try {
    const tours = await tourModel.find();
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
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success'
  });
};
exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success'
  });
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
