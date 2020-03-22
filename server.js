const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
process.on('uncaughtException', err => {
  console.log('UnCaught Exception Shutting Down Server');
  server.close(() => {
    process.exit(1);
  });
});
dotenv.config({ path: `${__dirname}/config.env` });
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log('Database connected'))
  .catch(e => {});
const port = process.env.PORT || 3000;
const server = app.listen(3000, () => {
  console.log('Connecting to server');
});
process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection Shutting Down Server');
  server.close(() => {
    process.exit(1);
  });
});
