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
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A tour must have a name']
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});
const testTour = mongoose.model('Tour', tourSchema);
const data = new testTour({
  name: 'Kufri'
});
data
  .save()
  .then(res => console.log(res))
  .catch(err => console.log(err));
const app = require('./app');
app.listen(3000, () => {
  console.log('Connecting to server');
});
