const express = require('express')
const http = require('http');
const cors = require('cors')

const collectorRouter = require('../server/router/collector')


const collectorOneApp = express()
const collectorOneServer = http.createServer(collectorOneApp);

const collectorTwoApp = express()
const collectorTwoServer = http.createServer(collectorTwoApp);

const collectorThreeApp = express()
const collectorThreeServer = http.createServer(collectorThreeApp);

// For collectors One, Two and Three
collectorOneApp.use(express.json());
collectorOneApp.use(cors())

collectorTwoApp.use(express.json());
collectorTwoApp.use(cors())

collectorThreeApp.use(express.json());
collectorThreeApp.use(cors())

collectorOneApp.use(collectorRouter)
collectorTwoApp.use(collectorRouter)
collectorThreeApp.use(collectorRouter)


const collectorAPort = process.env.collectorPORT || 3001;
const collectorBPort = process.env.collectorPORT || 3002;
const collectorCPort = process.env.collectorPORT || 3003;

collectorOneServer.listen(collectorAPort, () => {
  console.log(`Collectors are listening on port ${collectorAPort}`)
})

collectorTwoServer.listen(collectorBPort, () => {
console.log(`Collectors are listening on port ${collectorBPort}`)
})

collectorThreeServer.listen(collectorCPort, () => {
console.log(`Collectors are listening on port ${collectorCPort}`)
})