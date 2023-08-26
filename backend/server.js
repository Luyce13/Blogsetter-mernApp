const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const { connectDb } = require('./config/db')
const { errorHandler } = require('./middleware/errorHandler')

const port = process.env.PORT || 8000

const app = express()

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/goals', require('./routes/goalRoutes'))
app.use(errorHandler)

app.listen(port, () => { console.log(`Server Started At port: ${port}`) })