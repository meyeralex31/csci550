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



module.exports = router;