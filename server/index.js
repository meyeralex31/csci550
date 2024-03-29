const express = require('express')
const cors = require('cors')

const app = express()

const connectDB = require('./db/mongoose');

const profileRouter = require('../server/router/profile')
const voterRouter = require('../server/router/voter')
const electionRouter = require('../server/router/election')
const collectorRouter = require('../server/router/collector')

app.use(express.json());
app.use(cors())

// To establish a MongoDB connection
connectDB()

const port = process.env.PORT || 8080;

app.use(profileRouter)
app.use(voterRouter)
app.use(electionRouter)
app.use(collectorRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



