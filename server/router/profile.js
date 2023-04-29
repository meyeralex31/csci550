const express = require('express');

const Profile = require('../models/profileModel')
const genProfileId = require('../utilities/idGen');
const CryptoJS = require('crypto-js');

const router = new express.Router();;

const maxRandomNumber = 1000;
//An endpoint to fetch all of the user profiles
router.get('/profiles', async (req,res) => {
    try {
        const profiles = await Profile.find();
        return res.json(profiles)
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})


//To register a new user
router.post('/signup', async (req,res) => {
    try {
        const profile = new Profile(req.body);
        const profileId = genProfileId();
        profile.salt = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(16));
        profile.password = CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(String(req.body.password + profile.salt)));
        profile.profileId = profileId;
        await profile.save();
        return res.status(201).json({"type": "SUCCESS","message":"Voter registered"})
    } catch(e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})
router.post('/login/challenge', async (req,res) => {
    try {
        const {challengeResult, nonce,username } = req.body;
        if(username && challengeResult && nonce ) {
            const profileObj = await Profile.findOne({ username});
            const key = CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(String(profileObj.password + nonce))).slice(
                0,
                24
            );
            const expectedValue = CryptoJS.AES.decrypt(challengeResult, key).toString(
                CryptoJS.enc.Utf8
            );
            const expected = profileObj.challengeResult;
            profileObj.challengeResult = null;
            await profileObj.save();
            if(profileObj && expected === expectedValue) {
                console.log("Successfully Authenticated")
                return res.status(200).json({"type": "SUCCESS","message":"User logged in", profileId: profileObj.profileId})
            } else {
                return res.status(400).json({"type": "ERROR","message":"Bad Request"})
            }
        } else {
            return res.status(400).json({"type": "ERROR","message":"Bad Request"})
        }
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})
//To authenticate a user
//Pass to encrypted later
router.post('/login', async (req,res) => {
    try {
        if(req.body.username) {
        
            const profileObj = await Profile.findOne(req.body);
            if(profileObj) {
                const nonce = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(16));
                const key = CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(String(profileObj.password + nonce))).slice(
                    0,
                    24
                  );
                const challenge = {value1:  Math.floor(Math.random() *maxRandomNumber) +1,  value2: Math.floor(Math.random() *maxRandomNumber) + 1};
                profileObj.challengeResult = challenge.value1 + challenge.value2;
                await profileObj.save();
                const encrypted = CryptoJS.AES.encrypt(JSON.stringify(challenge), key).toString();
                return res.status(200).json({"type": "SUCCESS","message":"Challenge sent",nonce, challenge: encrypted, salt: profileObj.salt})
            } else {
                return res.status(400).json({"type": "ERROR","message":"Bad Request"})
            }
        } else {
            return res.status(400).json({"type": "ERROR","message":"Bad Request"})
        }
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})


module.exports = router;



