const express = require('express');

const Collector = require('../models/collectorModel')

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

router.get('/collectorDtls', async (req,res) => {
    try {
        return res.json({"type": "SUCCESS", collectors: await Collector.find(undefined, {name: 1, collectorId: 1})})
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

module.exports = router;