const user = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
exports.signup = catchAsync(async (req, res) => {
  const newuser = await user.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      user: newuser
    }
  });
});
