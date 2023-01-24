const express = require('express');

const Profile = require('../models/profileModel')

const router = new express.Router();

//An endpoint to fetch all of the user profiles
router.get('/profiles', async (req,res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles)
    } catch(err) {
        console.log(`Exception caught --------> ${err}`)
        res.status(500).send(err);
    }
})


//To register a new user
router.post('/signup', async (req,res) => {
    try {
        const profile = new Profile(req.body);
        await profile.save();
        res.status(201).json(profile);
    } catch(e) {
        console.log(`Exception caught --------> ${e}`)
        res.status(500).send(e);
    }
})

//To authenticate a user
router.post('/login', async (req,res) => {
    try {
        console.log(req.body)
        if(req.body.username && req.body.password) {
            const profileObj = await Profile.findOne(req.body);
            console.log(profileObj);
            if(profileObj && profileObj.password === req.body.password) {
                console.log("Successfully Authenticated")
                res.status(201).send()
            } else {
                console.log("Incorrect password")
                res.status(400).send()
            }
        }
    } catch(e) {
        console.log(`Exception caught --------> ${e}`)
        res.status(500).send(e);
    }
})


module.exports = router;



