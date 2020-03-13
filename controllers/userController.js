const userModel = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userModel.find();
  res.status(201).json({
    status: 'Success',
    result: users.length,
    data: {
      users
    }
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Internal Error'
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Internal Error'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Internal Error'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Internal Error'
  });
};
