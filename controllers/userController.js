const userModel = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const filter = (obj, ...allowedField) => {
  newobj = {};
  Object.keys(obj).forEach(el => {
    if (allowedField.includes(el)) newobj[el] = obj[el];
  });
  return newobj;
};
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
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new appError('This route is not for password change', 401));
  }

  const filtered = filter(req.body, 'name', 'email');
  const user = await userModel.findByIdAndUpdate(req.users._id, filtered, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'Success',
    message: 'Updated your details',
    data: {
      user
    }
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const dlete = await userModel.findByIdAndUpdate(req.users.id, {
    active: false
  });
  res.status(200).json({
    status: 'Success'
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
