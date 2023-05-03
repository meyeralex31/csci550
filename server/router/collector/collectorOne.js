const express = require('express');

const collectorProfileModel = require('../../models/collectorProfileModel')
const CollectorElectionModel = require('../../models/collectorElectionModel')

const { firstPhase, secondPhase } = require('../../utilities/collectorUtil')
const { lastPhase } = require('../../utilities/collectorUtil')

const generateRouter = (collectorId) => {
    const router = new express.Router();
    router.post('/collectorProfileShares', async (req,res) => {
        try {
            const  { electionId, voterId } = req.body;
            let response = await collectorProfileModel.findOne({collectorId, electionId, voterId} ,{secretShares : 1, locationShare: 1})
            return res.json({"type": "SUCCESS", response})
        } catch(err) {
            console.log(`Exception caught --------> ${err}`)
            return res.status(500).send(err);
        }
    })

    const stage1 = async (voters) => {
        let collectorShares = await firstPhase(voters.length);
        console.log(collectorShares)
            
        let { encValues , publicKey, privateKey} = collectorShares
        delete privateKey.publicKey;
        const serializedPrivateKey = {}
        for (const [key, value] of Object.entries(privateKey)) {
            serializedPrivateKey[key] = value.toString(); // Convert BigInt value to string
        }
        const serializedEncValues = encValues.map(value => value.toString()); 
        // publicKey = publicKey.n.toString()
        const serializedPublicKey = {};
        for (const [key, value] of Object.entries(publicKey)) {
            serializedPublicKey[key] = value.toString(); // Convert BigInt value to string
        } 
        return { privateKey: JSON.stringify(serializedPrivateKey), serializedEncValues, serializedPublicKey }
    }

    function genVoterShares(numofVoters) {
        const min = -Math.pow(2, numofVoters) + 1;
        const max = Math.pow(2, numofVoters) + 1;
        const randomNum = Math.floor(Math.random() * (max - min)) + min;
        return randomNum;
    }

    // TODO 
    // for each voter we need to verify there ballot is valid
    router.post('/verify',async (req,res) => {} )
    // for each election get all shares for each question
    router.post('/getAllShares',async (req,res) => {} )


    router.post('/generateShares', async (req,res) => {
        try {
            const { step, electionId, questions, voters } = req.body;
            const valuesToSave = { collectorId, electionId };

            if (step === 0) {
                const {privateKey, serializedEncValues, serializedPublicKey} = await stage1(voters);
                valuesToSave.privateKey = privateKey;
                const newCollectorElectionModel = new CollectorElectionModel(valuesToSave);
                await newCollectorElectionModel.save();
                return res.json({"type": "SUCCESS" , "encValues" : serializedEncValues , publicKey : serializedPublicKey})
            } else {
                let { encValues , publicKey } = req.body
                const BigIntEncValues = encValues.map(value => BigInt(value)); 
                // publicKey = BigInt(publicKey)
                const serializedObj = {};
                for (const [key, value] of Object.entries(publicKey)) {
                    serializedObj[key] = BigInt(value); // Convert BigInt value to string
                }
                let collectorShares = await secondPhase(serializedObj , BigIntEncValues, step === 1);
                const serializedEncValues = collectorShares.encryptedValues.map(value => value.toString()); 
                const serializedRValues = collectorShares.r.map(value => value.toString());
                await Promise.all(voters.map((voter, i) =>
                    new collectorProfileModel({ collectorId, voterId: voter.voterId, electionId,locationShare: serializedRValues[i], 
                        secretShares: questions.map(({questionId}) => ({questionId, fowardShare: genVoterShares(voters.length), reverseShare: genVoterShares(voters.length)}))  }).save()
                )); 
                console.log(collectorShares);
                const newCollectorElectionModel = new CollectorElectionModel(valuesToSave);
                await newCollectorElectionModel.save();
                return res.json({"type": "SUCCESS" , "encValues" : serializedEncValues , r : serializedRValues})
            }
        } catch (err) {
            console.log(`Exception caught --------> ${err}`)
            return res.status(500).send(err);
        }
    })

    router.post('/decryptCollectorEncShares', async (req,res) => {
        try {
            let { encValues, electionId, voters, questions} = req.body
            let privateKey;
            let privateKeyHolder = await CollectorElectionModel.findOne({collectorId, electionId} ,{privateKey : 1})
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
            await Promise.all(voters.map((voter, i) => new collectorProfileModel({ collectorId, voterId: voter.voterId, electionId,locationShare: serializedDecValues[i],secretShares: questions.map(({questionId}) => ({questionId, fowardShare: genVoterShares(voters.length), reverseShare: genVoterShares(voters.length)})) }).save()));  
            return res.json({"type": "SUCCESS" , decryptedVals : serializedDecValues})
        } catch (err) {
            console.log(`Exception caught --------> ${err}`)
            return res.status(500).send(err);
        }
    })
    return router
}

module.exports = generateRouter;