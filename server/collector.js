const express = require('express')
const http = require('http');
const cors = require('cors')
const connectDB = require('./db/mongoose');

// To establish a MongoDB connection
connectDB()

const collectorRouter = require('../server/router/collector')
const collectorOneRouter = require('../server/router/collector/collectorOne')
const collectorTwoRouter = require('../server/router/collector/collectorTwo')
const collectorThreeRouter = require('../server/router/collector/collectorThree')
const collectorFourRouter = require('../server/router/collector/collectorFour')


const collectorOneApp = express()
const collectorOneServer = http.createServer(collectorOneApp);

const collectorTwoApp = express()
const collectorTwoServer = http.createServer(collectorTwoApp);

const collectorThreeApp = express()
const collectorThreeServer = http.createServer(collectorThreeApp);

const collectorFourApp = express()
const collectorFourServer = http.createServer(collectorFourApp);

// For collectors One, Two and Three
collectorOneApp.use(express.json());
collectorOneApp.use(cors())

collectorTwoApp.use(express.json());
collectorTwoApp.use(cors())

collectorThreeApp.use(express.json());
collectorThreeApp.use(cors())

collectorFourApp.use(express.json());
collectorFourApp.use(cors())

collectorOneApp.use(collectorOneRouter)
collectorTwoApp.use(collectorTwoRouter)
collectorThreeApp.use(collectorThreeRouter)
collectorFourApp.use(collectorFourRouter)



const collectorAPort = process.env.collectorPORT || 3001;
const collectorBPort = process.env.collectorPORT || 3002;
const collectorCPort = process.env.collectorPORT || 3003;
const collectorDPort = process.env.collectorPORT || 3004;

collectorOneServer.listen(collectorAPort, () => {
  console.log(`Collectors are listening on port ${collectorAPort}`)
})

collectorTwoServer.listen(collectorBPort, () => {
console.log(`Collectors are listening on port ${collectorBPort}`)
})

collectorThreeServer.listen(collectorCPort, () => {
console.log(`Collectors are listening on port ${collectorCPort}`)
})

collectorFourServer.listen(collectorDPort, () => {
  console.log(`Collectors are listening on port ${collectorDPort}`)
 })



//  //Collector A
//  collectorOneApp.post('/CollectorOneInfo', async (req,res) => {
//   try {
//       const  { collectorId } = req.body;
//       const { url } = req.body;
//       if(!collectorId) {
//           return res.status(400).json("Bad Request");
//       }
//       await Collector.findOneAndUpdate( { collectorId }, { url });
//       return res.json({"type": "SUCCESS","message":"Collectors updated"})
//   } catch(err) {
//       console.log(`Exception caught --------> ${err}`)
//       return res.status(500).send(err);
//   }
// })