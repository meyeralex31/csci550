const express = require('express');
const { uuid } = require('uuidv4');
const { createPi } = require('../utilities/collectorUtil');
const Election = require('../models/electionModel')
const Collector = require('../models/collectorModel')
const Voter = require('../models/voterModel')
const axios = require('axios');
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
        
            if(REGISTRATION_STATUS === "Voting Started") {
                // add collector logic here
                const pi = createPi(collectors.length);
                let encValues = undefined; 
                let publicKey = undefined;
                const { questions } = await Election.findOne( {electionId} , { questions: 1 });
                const profiles = await Voter.find( { electionId }, {profileId: 1, hasRegistered: 1});
                const voters = profiles.filter(profile => profile.hasRegistered);
                let firstUrl = undefined;
                for (let i = 0; i < pi.length; i++) {
                    const {url} = await Collector.findOne({collectorId: collectors[pi[i]]}, {url: 1});
                    const res = await axios.post(`${url}/generateShares`, {step: i, electionId, voters, questions, encValues, publicKey });
                    encValues = res.data.encValues;
                    if (i === 0) {
                        publicKey = res.data.publicKey;
                        firstUrl = url
                    }
                }
                await axios.post(`${firstUrl}/decryptCollectorEncShares`, {electionId, voters, questions, encValues, publicKey });
                await Election.findOneAndUpdate( { adminProfileId,electionId }, {REGISTRATION_STATUS, collectors, locationN: publicKey.n, totalVoters: voters.length});
            } else {
                await Election.findOneAndUpdate( { adminProfileId,electionId }, {REGISTRATION_STATUS});
            }
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

    try {
        const Elections = await Election.find({}, { adminProfileId: 1, collectors: 1,electionId: 1, electionTitle : 1 , questions: 1, REGISTRATION_STATUS : 1, locationN: 1 });
        return res.json(Elections);
    } catch(e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})

//Display available Elections
router.post('/getElection', async (req,res) => {
    const electionId = req.body.electionId;

    try {
        const Elections = await Election.find({...(electionId ? {electionId} : {}) }, { adminProfileId: 1, collectors: 1,electionId: 1, electionTitle : 1 , questions: 1, REGISTRATION_STATUS : 1, locationN: 1, totalVoters: 1 });
        let collectors = undefined;
        if (Elections?.[0]?.collectors) {
            collectors =  await Promise.all(Elections?.[0]?.collectors?.map(async (id) => {
                const {url} = await Collector.findOne({collectorId: id}, {url: 1});
                return {url, collectorId: id};
            }));
        }
        return res.json([{ ...Elections[0]._doc, collectors}])
    } catch(e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})

return router;
}

module.exports = createRouter;