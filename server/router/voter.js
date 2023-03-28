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
        const  { profileId, electionId } = req.body;
        if(!profileId) {
            return res.status(400).json("Bad Request");
        }
        const search = { profileId, ...(electionId ? {electionId} :{} )}
        const VoterDtls = await Voter.find(search, { electionId : 1 , hasRegistered : 1, isElectionOwner: 1 });
        return res.json(VoterDtls);
    } catch(e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})

router.post('/registerVoter', async (req,res) => {
    try {
        const  { electionId, profileId, hasRegistered } = req.body;
        if(!electionId || !profileId) {
            return res.status(400).json("Bad Request");
        }
        await Voter.findOneAndUpdate( { electionId, profileId }, {hasRegistered}, {
            upsert: true 
          });
        return res.status(200).send({hasRegistered: hasRegistered})
    } catch (e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})



module.exports = router;