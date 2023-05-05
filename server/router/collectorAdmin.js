const express = require('express');
const axios = require('axios')

const Collector = require('../models/collectorModel');
const Election = require('../models/electionModel')
const CollectorProfileModel = require('../models/collectorProfileModel')
const Voter = require('../models/voterModel')


const router = new express.Router();

router.post('/updateCollectorDtls', async (req,res) => {
    try {
        const  { collectorId } = req.body;
        const { url } = req.body;
        if(!collectorId) {
            return res.status(400).json("Bad Request");
        }
        await Collector.findOneAndUpdate( { collectorId }, { url });
        return res.json({"type": "SUCCESS","message":"Collectors updated"})
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

router.post('/verify',async (req,res) => {
    //This is the admin server
    //To find the particular voter from the voter model
    try {
        let { electionId, voterId } = req.body;
        let voters = await Voter.findOne({electionId, profileId : voterId})
        let voterObj = voters.toObject();
        const Elections = await Election.find({electionId}, { collectors: 1});
        const collectors = await Promise.all(Elections?.[0]?.collectors?.map(async (id) => {
                return  await Collector.findOne({collectorId: id}, {url: 1});
        }));
        voterObj.questionsVotedOn.map(async (question,index) => {
            let vshares = []
            let vprimeShares = []
            let forwardShare = []
            let reverseShare = []
            vshares.push(question.forwardBallot)
            vprimeShares.push(question.reverseBallot)
            let { data } = await axios.post(`${collectors[index].url}/validate`, {electionId, voterId, questionId: question.questionId })
            forwardShare.push(data.resp[0].secretShares[0].fowardShare)
            reverseShare.push(data.resp[0].secretShares[0].reverseShare)
            await verifyVoterLocation(forwardShare,reverseShare,vshares,vprimeShares)

        })
        return res.json({"type": "SUCCESS"})
    } catch (err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})


router.get('/collectorDtls', async (req,res) => {
    try {
        return res.json({"type": "SUCCESS", collectors: await Collector.find(undefined, {name: 1, collectorId: 1, url: 1})})
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

module.exports = router;