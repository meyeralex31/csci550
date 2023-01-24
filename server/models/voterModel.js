const mongoose = require('mongoose');

const voterSchema = mongoose.Schema (
    {   
        voterName: {
            type: String,
            required: true
        }, 
        hasVoted : {
            type: Boolean,
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

const voterDtls = mongoose.model("Voters", voterSchema);

module.exports = voterDtls;