const express = require('express');

const CollectorFour = require('../../models/collectorFourModel')

const router = new express.Router();


router.post('/collectorFourShares', async (req,res) => {
    try {
        const  { electionId } = req.body;
        let response = await CollectorFour.findOne({electionId} ,{secretShare : 1})
        return res.json({"type": "SUCCESS", response})
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

module.exports = router;