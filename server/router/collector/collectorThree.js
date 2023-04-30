const express = require('express');

const CollectorThree = require('../../models/collectorThreeModel')

const router = new express.Router();


router.post('/collectorThreeShares', async (req,res) => {
    try {
        const  { electionId } = req.body;
        let response = await CollectorThree.findOne({electionId} ,{secretShare : 1})
        return res.json({"type": "SUCCESS", response})
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

module.exports = router;