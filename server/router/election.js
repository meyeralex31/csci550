const express = require('express');
const { uuid } = require('uuidv4');

const Election = require('../models/electionModel')
const Collector = require('../models/collectorModel')

const createRouter = (socket) => {

const router = new express.Router();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

//Endpoint to create an election
    router.post('/createElection', async (req,res) => {
        try {
            const election = new Election(req.body);
            election.electionId = uuid();
            await election.save();
            return res.status(201).json({"type": "SUCCESS","message":`Election Started for ${election.electionId}`, electionId: election.electionId})
        } catch(e) {
            console.log(`Exception caught --------> ${e}`)
            return res.status(500).send(e);
        }
    })

// Endpoint to update Elections
    router.put('/updateElection', async (req,res) => {
        try {
            const adminProfileId = req.body.profileId;
            const electionId = req.body.electionId;
            const REGISTRATION_STATUS = req.body.REGISTRATION_STATUS
            const collectors = req.body.collectors
            if(!adminProfileId || !electionId) {
                return res.status(400).json("Bad Request");
            }
            // add collector logic here
            collectors.map(async (collector, index) => {
                let collectorEntry = new Collector({name: collector.id, voterId: adminProfileId, electionId, secretShare: getRandomInt(20) })
                await collectorEntry.save();
            })
            await Election.findOneAndUpdate( { adminProfileId,electionId }, {REGISTRATION_STATUS, collectors});
            socket.emit(`status-${electionId}`, {status: REGISTRATION_STATUS})
            // To see if it's started and to gen ind question shares & location of every user
            return res.json({"type": "SUCCESS","message":"Election updated"})
        } catch(e) {
            console.log(`Exception caught --------> ${e}`)
            return res.status(500).send(e);
        }
    })

//Display available Elections
    router.post('/displayElections', async (req,res) => {
        const electionId = req.body.electionId;

        try {
            const Elections = await Election.find({...(electionId ? {electionId} : {}) }, { adminProfileId: 1, collectors: 1,electionId: 1, electionTitle : 1 , questions: 1, REGISTRATION_STATUS : 1 });
            return res.json(Elections)
        } catch(e) {
            console.log(`Exception caught --------> ${e}`)
            return res.status(500).send(e);
        }
    })
    return router;
}



module.exports = createRouter;