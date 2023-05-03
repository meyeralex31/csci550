const mongoose = require('mongoose');

const collectorSchema = mongoose.Schema (
    {   
        collectorId : {
            type: mongoose.Schema.Types.ObjectId
        },
        voterId: {
            type: String,
        },
        electionId : {
            type: String,
        },
        secretShares: [{
            questionId: {
                type: String
            },
            fowardShare : {
                type: String,
            },
            reverseShare : {
                type: String,
            },
        }],
        locationShare : {
            type: String,
        },
    }, {
        timestamps: true,
    }
)

const collectorProfileModel = mongoose.model("CollectorFour", collectorSchema);

module.exports = collectorProfileModel;