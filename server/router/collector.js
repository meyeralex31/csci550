const express = require('express');

const Collector = require('../models/collectorModel')

const router = new express.Router();

//An endpoint to fetch the secret ballot of a profile
router.post('/updateCollectorDtls', async (req,res) => {
    try {
        const  { electionId } = req.body;
        const { url } = req.body;
        if(!electionId) {
            return res.status(400).json("Bad Request");
        }
        await Collector.findOneAndUpdate( { electionId }, { url });
        return res.json({"type": "SUCCESS","message":"Collectors updated"})
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

module.exports = router;