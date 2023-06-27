const express = require('express')
const cors = require('cors')
const workoutRouter = require('./routes/workoutRoutes')
const userRouter = require('./routes/userRoutes')
const authRouter = require('./routes/authRoutes')
const errorHandler = require('./controllers/errorController')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const app = express()
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
app.use(cors())

// app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded())
app.use(mongoSanitize())
app.use(xss())

app.use('/api/v1/workouts', workoutRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use((req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Route not found.'
    })
})

app.use(errorHandler)

module.exports = app