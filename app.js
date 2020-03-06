const express = require('express')

const fs = require('fs')
const app = express()
app.use(express.json())
const tours = JSON.parse(
  fs.readFileSync(`./dev-data/data/tours-simple.json`, 'utf-8')
)

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours
    }
  })
})
app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1
  const tour = tours.find(el => el.id === id)

  res.status(200).json({
    status: 'success',

    data: {
      tour
    }
  })
})
app.patch('/api/v1/tours/:id', (req, res) => {
  res.status(200).json({
    status: 'success'
  })
})
app.delete('/api/v1/tours/:id', (req, res) => {
  res.status(200).json({
    status: 'success'
  })
})
app.post('/api/v1/tours', (req, res) => {
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
})
app.listen(3000, () => {
  console.log('Connecting to server')
})
