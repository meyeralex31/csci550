const express = require('express');

const CollectorFour = require('../../models/collectorFourModel')

const { secondPhase } = require('../../utilities/collectorUtil')


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

router.post('/generateCollectorFourShares', async (req,res) => {
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