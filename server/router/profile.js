const express = require('express');

const Profile = require('../models/profileModel')

const router = new express.Router();

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
        await profile.save();
        return res.status(201).json({"type": "SUCCESS","message":"Voter registered"})
    } catch(e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})

//To authenticate a user
router.post('/login', async (req,res) => {
    try {
        if(req.body.username && req.body.password) {
            const profileObj = await Profile.findOne(req.body);
            if(profileObj && profileObj.password === req.body.password) {
                console.log("Successfully Authenticated")
                return res.status(200).json({"type": "SUCCESS","message":"User logged in"})
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



