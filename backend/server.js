const app = require('./app')

const dotenv = require('dotenv')
const mongoose = require('mongoose')

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

module.exports = server
