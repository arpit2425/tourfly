const express = require('express');
const rateLimit = require('express-rate-limit');
const tourRoutes = require('./routes/tourRoutes');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const appError = require('./utils/appError');
const app = express();
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request please try after an hour'
});
app.use('/api', limiter);
app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use((req, res, next) => {
  req.requestedAt = new Date().toLocaleString();
  next();
});

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.all('*', (req, res, next) => {
  // const err = new Error('Route not defined');
  // err.status = 'Fail';
  // err.statusCode = 404;
  next(new appError('Route not defined', 404));
});
app.use(globalErrorHandler);
module.exports = app;
