const express = require('express');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use((req, res, next) => {
  req.requestedAt = new Date().toLocaleString();
  next();
});

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;
