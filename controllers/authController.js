const user = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const sendToken = id => {
  return jwt.sign({ id }, process.env.jwtToken, {
    expiresIn: process.env.expiresIn
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newuser = await user.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  const token = sendToken(newuser._id);
  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newuser
    }
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Please Provide Email and password', 400));
  }
  const getuser = await user.findOne({ email }).select('+password');
  if (
    !getuser ||
    !(await getuser.correctPassword(password, getuser.password))
  ) {
    return next(new appError('Please Provide correct Email and password', 401));
  }

  const token = sendToken(getuser._id);
  res.status(200).json({
    status: 'Success',
    token
  });
});
