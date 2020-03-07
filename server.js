const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(db).then(() => console.log('Database connected'));

const app = require('./app');
app.listen(3000, () => {
  console.log('Connecting to server');
});
