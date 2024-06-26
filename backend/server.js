require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const csurf = require('@dr.pogodin/csurf')
const workoutRoutes = require('./routes/workouts')
// express app
const app = express()

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())
app.use(cookieParser());
app.use(csurf({ cookie: true }))

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// CSRF token route
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// routes
app.use('/api/workouts', workoutRoutes)

// Error handling for CSRF token errors
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ message: 'Invalid CSRF token' })
  } else {
    next(err)
  }
})

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 