const express = require('express')

const app = express()

const connectDB = require('./db/mongoose');
const profileRouter = require('../server/router/profile')
app.use(express.json());

// To establish a MongoDB connection
connectDB()

const port = process.env.PORT || 8080;

app.use(profileRouter)

// app.use(voterRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



