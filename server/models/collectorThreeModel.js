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
        }
    }, {
        timestamps: true,
    }
)

const collectorThree = mongoose.model("CollectorThree", collectorSchema);

module.exports = collectorThree;