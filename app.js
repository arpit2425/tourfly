const express = require('express')

const fs = require('fs')
const app = express()
app.use(express.json())
app.use((req, res, next) => {
  req.requestedAt = new Date().toLocaleString()
  next()
})
const tours = JSON.parse(
  fs.readFileSync(`./dev-data/data/tours-simple.json`, 'utf-8')
)

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      requestedAt: req.requestedAt,
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
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Internal Error'
  })
}
const createUser = (req, res) => {
  res.status(500).json({
    status: 'Internal Error'
  })
}
const getUser = (req, res) => {
  res.status(500).json({
    status: 'Internal Error'
  })
}
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'Internal Error'
  })
}
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Internal Error'
  })
}
const tourRoutes = express.Router()
const userRoutes = express.Router()
tourRoutes
  .route('/')
  .get(getAllTours)
  .post(createTour)
tourRoutes
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)
userRoutes
  .route('/')
  .get(getAllUsers)
  .post(createUser)
userRoutes
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)
app.use('/api/v1/tours', tourRoutes)
app.use('/api/v1/users', userRoutes)

app.listen(3000, () => {
  console.log('Connecting to server')
})
