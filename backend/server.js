const app = require('./app')

const dotenv = require('dotenv')
const mongoose = require('mongoose')

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...')
    console.log(err.name, err.message)
    process.exit(1)
})

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con => {
    console.log('DB connection successful!')
})

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...')
    console.log(err.name, err.message)

    server.close(() => {  
        process.exit(1)  
    })
})

module.exports = server
