const mongoose = require('mongoose');

const voterSchema = mongoose.Schema (
    {   
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