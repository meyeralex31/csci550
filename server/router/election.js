const express = require('express');
const { findOneAndUpdate } = require('../models/electionModel');

const Election = require('../models/electionModel')

const router = new express.Router();

//Endpoint to create an election
    router.post('/createElection', async (req,res) => {
        try {
            const election = new Election(req.body);
             await election.save();
             return res.status(201).json({"type": "SUCCESS","message":"Election Started"})
        } catch(e) {
            console.log(`Exception caught --------> ${e}`)
            return res.status(500).send(e);
        }
    })

// Endpoint to update Elections
    router.put('/updateElection', async (req,res) => {
        try {
            const adminProfileId = req.body.profileId;
            const REGISTRATION_STATUS = req.body.REGISTRATION_STATUS
            const collectors = req.body.collectors
            if(!adminProfileId) {
                return res.status(400).json("Bad Request");
            }
            await Election.findOneAndUpdate( { adminProfileId }, {REGISTRATION_STATUS, collectors});
            return res.json({"type": "SUCCESS","message":"Election updated"})
        } catch(e) {
            console.log(`Exception caught --------> ${e}`)
            return res.status(500).send(e);
        }
    })

//Display available Elections
    router.post('/displayElections', async (req,res) => {
        try {
            const Elections = await Election.find({}, { electionTitle : 1 , REGISTRATION_STATUS : 1 });
            return res.json(Elections)
        } catch(e) {
            console.log(`Exception caught --------> ${e}`)
            return res.status(500).send(e);
        }
    })



module.exports = router;