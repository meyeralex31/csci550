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
        name: {
            type: String,
        },
        secretShare : {
            type: String,
        },
        privateKey : {
            type: String
        }
    }, {
        timestamps: true,
    }
)

const collectorOne = mongoose.model("CollectorOne", collectorSchema);

module.exports = collectorOne;