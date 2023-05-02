const express = require('express');

const CollectorThree = require('../../models/collectorThreeModel')

const { secondPhase } = require('../../utilities/collectorUtil')

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

router.post('/generateCollectorThreeShares', async (req,res) => {
    try {
        let { encValues , publicKey} = req.body
        const BigIntEncValues = encValues.map(value => BigInt(value)); 
        // publicKey = BigInt(publicKey)
        const serializedObj = {};
        for (const [key, value] of Object.entries(publicKey)) {
            serializedObj[key] = BigInt(value); // Convert BigInt value to string
        }
        let collectorShares = await secondPhase(serializedObj , BigIntEncValues, false);
        const serializedEncValues = collectorShares.encryptedValues.map(value => value.toString()); 
        const serializedRValues = collectorShares.r.map(value => value.toString()); 
        console.log(collectorShares)
        // ({encryptedValues, r: ri} = await secondPhase(publicKey, encryptedValues, i ===1));
        // console.log(collectorShares)
        return res.json({"type": "SUCCESS" , "encValues" : serializedEncValues , r : serializedRValues})
    } catch (err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

module.exports = router;