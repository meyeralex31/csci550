const express = require('express');

const Collector = require('../models/collectorModel')
const Voter = require('../models/voterModel')

const router = new express.Router();

//An endpoint to fetch the secret ballot of a profile
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

//TO do endpoint
// User will ask for shares and the collectors will respond back. 
// At the same time, user will need the location share as well

router.post('/userShares' , async (req,res) => {
    try {
        const  { voterId, electionId } = req.body;
        if(!voterId || !electionId) {
            return res.status(400).json("Bad Request");
        }
        const search = { ...(voterId ? {voterId} :{} ), ...(electionId ? {electionId} :{} )}
        const CollectorDtls = await Collector.find(search, { secretShare : 1  });
        const locDtls = await Voter.find(search, { secretLocation: 1 });
        let combinedRes = { coll: CollectorDtls, loc: locDtls };
        return res.json(combinedRes);
    } catch(e) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})


router.get('/collectorDtls', async (req,res) => {
    try {
        return res.json({"type": "SUCCESS", collectors: await Collector.find(undefined, {name: 1, collectorId: 1})})
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

// Validate the votes(using the hw formula in 3)

module.exports = router;