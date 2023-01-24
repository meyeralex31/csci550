const express = require('express')

const app = express()

const connectDB = require('./db/mongoose');

// To establish a MongoDB connection
connectDB()

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



