const mongoose = require('mongoose');

//Add to current schema
// electionId, secretBallot(secret Location), hasRegistered, isElectionOwner

const voterSchema = mongoose.Schema (
    {   
        hasVoted : {
            type: Boolean,
            required: true
        },
        profileId : {
            type: String,
            required: true
        },
        electionId: {
            type: String,
            // required: true
        },
        secretBallot : {
            type: String,
            // required: true 
        },
        hasRegistered : {
            type: Boolean,
            // required: true
        },
        isElectionOwner : {
            type: Boolean,
            // required: true
        },
    }, {
        timestamps: true,
    }
)

//APIS to be created
// /secretLocation , /voterDtls, 


const voterDtls = mongoose.model("Voters", voterSchema);

module.exports = voterDtls;