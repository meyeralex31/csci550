const express = require('express');

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



module.exports = router;