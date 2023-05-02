const express = require('express');

const CollectorOne = require('../../models/collectorOneModel')

const { firstPhase } = require('../../utilities/collectorUtil')
const { lastPhase } = require('../../utilities/collectorUtil')

const router = new express.Router();


router.post('/collectorOneShares', async (req,res) => {
    try {
        const  { electionId } = req.body;
        let response = await CollectorOne.findOne({electionId} ,{secretShare : 1})
        return res.json({"type": "SUCCESS", response})
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

router.post('/generateCollectorOneShares', async (req,res) => {
    try {
        let collectorShares = await firstPhase();
        const { electionId, voterId } = req.body
        console.log(collectorShares)
        let { encValues , publicKey, privateKey} = collectorShares
        delete privateKey.publicKey;
        const serializedPrivateKey = {}
        for (const [key, value] of Object.entries(privateKey)) {
            serializedPrivateKey[key] = value.toString(); // Convert BigInt value to string
        }
        let saveToColl = {electionId, voterId , privateKey : JSON.stringify(serializedPrivateKey) }
        if (electionId && voterId) {
            const collectorOne = new CollectorOne(saveToColl);
            await collectorOne.save()
        }
        const serializedEncValues = encValues.map(value => value.toString()); 
        // publicKey = publicKey.n.toString()
        const serializedObj = {};
        for (const [key, value] of Object.entries(publicKey)) {
            serializedObj[key] = value.toString(); // Convert BigInt value to string
        }
        // const serializedPrivateKeyValues = privateKey.map(value => value.toString()); 
        return res.json({"type": "SUCCESS" , "encValues" : serializedEncValues , publicKey : serializedObj})
    } catch (err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

router.post('/decryptCollectorEncShares', async (req,res) => {
    try {
        let { encValues, voterId, electionId} = req.body
        let privateKey;
        let privateKeyHolder = await CollectorOne.findOne({electionId, voterId} ,{privateKey : 1})
        // for (let i = 0; i < privateKeyHolder.length; i++) {
        //     privateKey  = privateKeyHolder[i].privateKey ;
        //   }
        privateKey = JSON.parse(privateKeyHolder.privateKey)
        // Let's deserialize private key values and also the enc values
        const deserializedPrivateKeyObj = {};
        // const  deserializedEncVals = {}
        for (const [key, value] of Object.entries(privateKey)) {
            deserializedPrivateKeyObj[key] = BigInt(value); // Convert String to BigInt
        }
        // for (const [key, value] of Object.entries(encValues)) {
        //     deserializedEncVals[key] = BigInt(value); // Convert String to BigInt
        // }
        const deserializedEncValues = encValues.map(value => BigInt(value)); 
        let decryptedVals = await lastPhase(deserializedPrivateKeyObj , deserializedEncValues)
        console.log(decryptedVals)
        const serializedDecValues = decryptedVals.map(value => value.toString()); 
        return res.json({"type": "SUCCESS" , decryptedVals : serializedDecValues})
    } catch (err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

module.exports = router;