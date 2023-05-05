const express = require('express');

const Collector = require('../models/collectorModel')
const Voter = require('../models/voterModel')

const router = new express.Router();

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

// Validate the votes(using the hw formula in 3)

module.exports = router;