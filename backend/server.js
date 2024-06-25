require('dotenv').config()

const express = require('express')
const session = require('express-session')
const csrf = require('csrf-tokens')
const helmet = require('helmet')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts')

// express app
const app = express()

// middleware
app.use(express.json())
app.use(helmet())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  if (req.session) {
    req.csrfToken = csrf();
    res.locals.csrfToken = req.csrfToken;
  }
  next()
})

app.use(session({
  secret: 'ceci est un secret',
  resave: false,
  saveUninitialized: false
}));

// routes
app.use('/api/workouts', workoutRoutes)

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