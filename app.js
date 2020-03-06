const express = require('express')

const fs = require('fs')
const app = express()
app.use(express.json())
const tours = JSON.parse(
  fs.readFileSync(`./dev-data/data/tours-simple.json`, 'utf-8')
)

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours
    }
  })
}
const getTour = (req, res) => {
  const id = req.params.id * 1
  const tour = tours.find(el => el.id === id)
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}
const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success'
  })
}
const deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success'
  })
}
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1

  const newTour = Object.assign({ id: newId }, req.body)
  tours.push(newTour)
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      console.log(err)
    }
  )
  res.send('Ok')
}
app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour)
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

app.listen(3000, () => {
  console.log('Connecting to server')
})
