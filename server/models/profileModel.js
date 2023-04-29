const mongoose = require('mongoose');

const profileSchema = mongoose.Schema (
    {   
        username: {
            type: String,
            required: true
        }, 
        password : {
            type: String,
            required: true
        },
        salt : {
            type: String,
        },
        profileId : {
            type: String,
            // required: true
        },
         name: {
            type: String,
            required: true
        },
        // this is a temp object saying what we expect the challenge to result in
        challengeResult: {
            type: String,
        }
    }, {
        timestamps: true,
    }
)

const profile = mongoose.model("Profiles", profileSchema);

module.exports = profile;