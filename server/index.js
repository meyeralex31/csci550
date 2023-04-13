const express = require('express')
const cors = require('cors')
const http = require('http');

const app = express()
const collectorApp = express()
const server = http.createServer(app);
const collectorServer = http.createServer(collectorApp);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const connectDB = require('./db/mongoose');
const electionOwnerToSocketId = {};
const profileRouter = require('../server/router/profile')
const voterRouter = require('../server/router/voter')
const electionRouter = require('../server/router/election')
const collectorRouter = require('../server/router/collector')

app.use(express.json());
app.use(cors())

//For collectors
collectorApp.use(express.json());
collectorApp.use(cors())

// To establish a MongoDB connection
connectDB()
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})
const port = process.env.PORT || 8080;

app.use(profileRouter)
app.use(voterRouter(io, electionOwnerToSocketId))
app.use(electionRouter(io))
collectorApp.use(collectorRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
});
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('electionOwnerListening', (data) =>{
    if (data?.electionId && data?.socketID)  electionOwnerToSocketId[data?.electionId] = data?.socketID;
  } )
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const collectorPort = process.env.collectorPORT || 3002;

collectorServer.listen(collectorPort, () => {
  console.log(`Example app listening on port ${collectorPort}`)
})



