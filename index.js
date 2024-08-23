const express = require('express')
const cors = require('cors')
const cp = require('cookie-parser')
const morgan = require('morgan')
const mongoose = require("mongoose")
const app = express()
const port = 8080

require('dotenv').config()

const userRoutes = require('./routes/UserRoutes')
const weatherRoutes = require('./routes/WeatherRoutes')

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(cp())
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (_, res) => {
    res.send('WELCOME TO Krishi Bandhu App')
})

app.use('/api/users',userRoutes)
app.use('/api/weather',weatherRoutes)

mongoose
  .connect(
   process.env.MONGODB_URI
  )
  .then(() => {
    console.log("DB Connected")
  })
  .catch((err) => {
    console.log(err.message)
  })

app.listen(port, () => {
    console.log(port)
});