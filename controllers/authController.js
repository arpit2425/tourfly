const User = require('./../models/userModel');
const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const Email = require('./../utils/email');
const createSendToken = (user, statusCode, res) => {
  const token = sendToken(user._id);
  const options = {
    expires: new Date(
      Date.now() + process.env.cookieexpiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') options.secure = true;
  res.cookie('jwt', token, options);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user: user
    }
  });
};
const sendToken = id => {
  return jwt.sign({ id }, process.env.jwtToken, {
    expiresIn: process.env.expiresIn
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newuser, url).sendWelcome();
  createSendToken(newuser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Please Provide Email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Please Provide correct Email and password', 401));
  }

  createSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new appError('You are not logged in ! Please log in', 401));
  }
  const decode = await promisify(jwt.verify)(token, process.env.jwtToken);

  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return next(new appError('User Does not exist', 401));
  }
  if (freshUser.changedPasswordAfter(decode.iat)) {
    return next(new appError('Password is changed', 401));
  }
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.jwtToken
      );

      const freshUser = await User.findById(decode.id);
      if (!freshUser) {
        return next();
      }
      if (freshUser.changedPasswordAfter(decode.iat)) {
        return next();
      }
      res.locals.user = freshUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You dont have permission to perform this action', 403)
      );
    }
    next();
  };
};
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const users = await User.findOne({ email: req.body.email });
  if (!users) {
    return next(new appError('No user found with this email', 404));
  }
  const resetToken = users.createPasswordResetToken();
  await users.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await new Email(users, resetUrl).sendPasswordReset();
    res.status(200).json({
      status: 'Success',
      message: 'Token sent to email'
    });
  } catch (err) {
    (users.passwordResetToken = undefined),
      (users.passwordResetExpires = undefined),
      await users.save({ validateBeforeSave: false });
    return next(new appError('Something went wrong please try later', 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const getToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const getuser = await User.findOne({ passwordResetToken: getToken });
  const currentTime = new Date();
  if (!getuser || currentTime > getuser.passwordResetExpires) {
    return next(new appError('Token is invalid or Expired', 400));
  }
  getuser.password = req.body.password;
  getuser.passwordConfirm = req.body.passwordConfirm;
  getuser.passwordResetToken = undefined;
  getuser.passwordResetExpires = undefined;
  await getuser.save();
  createSendToken(getuser, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  if (
    !req.body.password ||
    !req.body.newpassword ||
    !req.body.newpasswordconfirm
  ) {
    return next(new appError('Please enter password', 400));
  }

  const getuser = await User.findById(req.user._id).select('+password');

  if (!(await getuser.correctPassword(req.body.password, getuser.password))) {
    return next(new appError('Password incorrect', 400));
  }

  if (req.body.newpassword !== req.body.newpasswordconfirm) {
    return next(
      new appError('Password and password confirm doesnt match ', 400)
    );
  }
  getuser.password = req.body.newpassword;
  getuser.passwordConfirm = req.body.newpasswordconfirm;
  await getuser.save();
  createSendToken(getuser, 200, res);
});
