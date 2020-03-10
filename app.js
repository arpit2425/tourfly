const express = require('express');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const appError = require('./utils/appError');
const app = express();
app.use(express.static(`${__dirname}/public`));
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
