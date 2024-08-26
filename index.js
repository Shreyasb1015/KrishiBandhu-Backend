const express = require('express')
const cors = require('cors')
const cp = require('cookie-parser')
const morgan = require('morgan')
const mongoose = require("mongoose")
const app = express()

require('dotenv').config()

const userRoutes = require('./routes/UserRoutes')
const weatherRoutes = require('./routes/WeatherRoutes')
const appointmentRoutes = require('./routes/AppointmentRoutes')
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
app.use('/api/appointment',appointmentRoutes)
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
const port = process.env.PORT
app.listen(port, () => {
    console.log(port)
});