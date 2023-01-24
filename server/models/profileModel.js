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
        profileId : {
            type: String,
            required: true
        }
    }, {
        timestamps: true,
    }
)

const profile = mongoose.model("Profiles", profileSchema);

module.exports = profile;