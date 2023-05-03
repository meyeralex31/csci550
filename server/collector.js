const express = require('express')
const http = require('http');
const cors = require('cors')
const connectDB = require('./db/mongoose');

// To establish a MongoDB connection
connectDB()

const collectorRouter = require('../server/router/collector')
const generateCollectorOne = require('../server/router/collector/collectorOne')
const collectorTwoRouter = require('../server/router/collector/collectorTwo')
const collectorThreeRouter = require('../server/router/collector/collectorThree')
const collectorFourRouter = require('../server/router/collector/collectorFour')

const collectors = [{port: '3001' , id: '6429c55c4cb576c0acd49c45'},
  {port: '3002' , id: '643ea062d91b072364d6f885'},
  {port: '3003' , id: '643ea063d91b072364d6f886'},
  {port: '3004' , id: '643ea061d91b072364d6f884'}]
collectors.forEach(({port, id}) => {
  const collectorOneApp = express()
  const collectorOneServer = http.createServer(collectorOneApp);
  // For collectors One, Two and Three
  collectorOneApp.use(express.json());
  collectorOneApp.use(cors());
  collectorOneApp.use(generateCollectorOne(id))
  collectorOneServer.listen(port, () => {
    console.log(`Collectors are listening on port ${collectorAPort}`)
  })
})