const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
var dbs = mongoose.connection;
// dbs.once('error', () => {
//   console.log('Message from connections');
// });
// dbs.on('error', console.error.bind(console, 'connection error:'));
const app = require('./app');
app.listen(3000, () => {
  console.log('Connecting to server');
});
