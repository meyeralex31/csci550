const express = require('express');

const Election = require('../models/electionModel')

const router = new express.Router();

//An endpoint to fetch the secret ballot of a profile
// router.post('/getSecretBallot', async (req,res) => {
//     try {
//         const ballotDoc = await Voter.findOne(req.body);
//         console.log(ballotDoc)
//         let secretBallot = ballotDoc.secretBallot ? ballotDoc.secretBallot : null;
//         return secretBallot !== null ?  res.json(secretBallot) :  res.json("Unable to fetch the ballot")
//     } catch(err) {
//         console.log(`Exception caught --------> ${err}`)
//         return res.status(500).send(err);
//     }
// })

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