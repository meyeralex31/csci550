const express = require('express');

const Voter = require('../models/voterModel')

const router = new express.Router();

//An endpoint to fetch the secret ballot of a profile
router.post('/getSecretBallot', async (req,res) => {
    try {
        const ballotDoc = await Voter.findOne(req.body);
        console.log(ballotDoc)
        let secretBallot = ballotDoc.secretBallot ? ballotDoc.secretBallot : null;
        return secretBallot !== null ?  res.json(secretBallot) :  res.json("Unable to fetch the ballot")
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

router.post('/getVoterDtls', async (req,res) => {
    try {
        const  { profileId } = req.body;
        if(!profileId) {
            return res.status(400).json("Bad Request");
        }
        const VoterDtls = await Voter.findOne({profileId}, { electionId : 1 , hasRegistered : 1, isElectionOwner: 1 });
        return res.json(VoterDtls);
    } catch(e) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})



module.exports = router;