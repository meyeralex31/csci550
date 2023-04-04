const express = require('express');
const { uuid } = require('uuidv4');

const Election = require('../models/electionModel')

const router = new express.Router();

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
            await Election.findOneAndUpdate( { adminProfileId,electionId }, {REGISTRATION_STATUS, collectors});
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



module.exports = router;